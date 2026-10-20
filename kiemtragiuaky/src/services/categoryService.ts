import { randomUUID } from 'expo-crypto';
import { TABLE_CATEGORY, TABLE_DISH } from '../config/student';
import { CategoryInput, Dish, DishCategory, Result } from '../models';
import { readTable, writeTable } from '../storage/localStore';
import { validateCategory } from '../validation/validate';

export async function listCategories(): Promise<DishCategory[]> {
  const rows = await readTable<DishCategory>(TABLE_CATEGORY);
  return rows.filter((c) => c.BIT240201_SyncStatus !== 'pending_delete');
}

export async function createCategory(input: CategoryInput): Promise<Result<DishCategory>> {
  const errors = validateCategory(input.BIT240201_Name);
  if (Object.keys(errors).length) return { ok: false, errors };
  const all = await readTable<DishCategory>(TABLE_CATEGORY);
  const row: DishCategory = {
    ...input,
    BIT240201_Name: input.BIT240201_Name.trim(),
    BIT240201_Id: randomUUID(),
    BIT240201_UpdatedAt: Date.now(),
    BIT240201_SyncStatus: 'pending_create',
  };
  await writeTable(TABLE_CATEGORY, [...all, row]);
  return { ok: true, data: row };
}

export async function deleteCategory(id: string): Promise<Result<true>> {
  const dishes = await readTable<Dish>(TABLE_DISH);
  const inUse = dishes.some(
    (d) => d.BIT240201_DishCategoryId === id && d.BIT240201_SyncStatus !== 'pending_delete',
  );
  if (inUse) return { ok: false, errors: { _: 'CATEGORY_IN_USE' } };

  const all = await readTable<DishCategory>(TABLE_CATEGORY);
  const target = all.find((c) => c.BIT240201_Id === id);
  if (!target) return { ok: false, errors: { _: 'NOT_FOUND' } };

  const next =
    target.BIT240201_SyncStatus === 'pending_create'
      ? all.filter((c) => c.BIT240201_Id !== id) // chưa lên server thì xóa hẳn
      : all.map((c) =>
          c.BIT240201_Id === id
            ? { ...c, BIT240201_SyncStatus: 'pending_delete' as const, BIT240201_UpdatedAt: Date.now() }
            : c,
        );
  await writeTable(TABLE_CATEGORY, next);
  return { ok: true, data: true };
}