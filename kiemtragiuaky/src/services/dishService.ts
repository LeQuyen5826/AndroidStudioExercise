import { randomUUID } from 'expo-crypto';
import { TABLE_DISH } from '../config/student';
import { Dish, DishImage, DishInput, Result } from '../models';
import { readTable, writeTable } from '../storage/localStore';
import { validateDish } from '../validation/validate';
import { listCategories } from './categoryService';

// Bảo đảm tối đa 1 ảnh IsThumbnail = true
function normalizeImages(images: DishImage[]): DishImage[] {
  let found = false;
  return images.map((img) => {
    if (img.BIT240201_IsThumbnail && !found) {
      found = true;
      return img;
    }
    return { ...img, BIT240201_IsThumbnail: false };
  });
}

export async function listDishes(): Promise<Dish[]> {
  const rows = await readTable<Dish>(TABLE_DISH);
  return rows.filter((d) => d.BIT240201_SyncStatus !== 'pending_delete');
}

export async function getDish(id: string): Promise<Dish | null> {
  const rows = await listDishes();
  return rows.find((d) => d.BIT240201_Id === id) ?? null; // null => UI báo "không tồn tại"
}

export async function createDish(input: DishInput): Promise<Result<Dish>> {
  const [existing, categories] = await Promise.all([listDishes(), listCategories()]);
  const errors = validateDish(input, existing, categories);
  if (Object.keys(errors).length) return { ok: false, errors };

  const all = await readTable<Dish>(TABLE_DISH);
  const row: Dish = {
    ...input,
    BIT240201_Name: input.BIT240201_Name.trim(),
    BIT240201_DishImages: normalizeImages(input.BIT240201_DishImages),
    BIT240201_Id: randomUUID(),
    BIT240201_UpdatedAt: Date.now(),
    BIT240201_SyncStatus: 'pending_create',
  };
  await writeTable(TABLE_DISH, [...all, row]);
  return { ok: true, data: row };
}

export async function updateDish(id: string, input: DishInput): Promise<Result<Dish>> {
  const all = await readTable<Dish>(TABLE_DISH);
  const old = all.find((d) => d.BIT240201_Id === id && d.BIT240201_SyncStatus !== 'pending_delete');
  if (!old) return { ok: false, errors: { _: 'NOT_FOUND' } };

  const [existing, categories] = await Promise.all([listDishes(), listCategories()]);
  const errors = validateDish(input, existing, categories, id);
  if (Object.keys(errors).length) return { ok: false, errors };

  const row: Dish = {
    ...old,
    ...input,
    BIT240201_Name: input.BIT240201_Name.trim(),
    BIT240201_DishImages: normalizeImages(input.BIT240201_DishImages),
    BIT240201_UpdatedAt: Date.now(),
    // chưa từng lên server thì vẫn là create
    BIT240201_SyncStatus: old.BIT240201_SyncStatus === 'pending_create' ? 'pending_create' : 'pending_update',
  };
  await writeTable(TABLE_DISH, all.map((d) => (d.BIT240201_Id === id ? row : d)));
  return { ok: true, data: row };
}

export async function deleteDish(id: string): Promise<Result<true>> {
  const all = await readTable<Dish>(TABLE_DISH);
  const target = all.find((d) => d.BIT240201_Id === id);
  if (!target) return { ok: false, errors: { _: 'NOT_FOUND' } };

  const next =
    target.BIT240201_SyncStatus === 'pending_create'
      ? all.filter((d) => d.BIT240201_Id !== id)
      : all.map((d) =>
          d.BIT240201_Id === id
            ? { ...d, BIT240201_SyncStatus: 'pending_delete' as const, BIT240201_UpdatedAt: Date.now() }
            : d,
        );
  await writeTable(TABLE_DISH, next);
  return { ok: true, data: true };
}