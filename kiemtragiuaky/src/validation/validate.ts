import { Dish, DishCategory, DishInput, Errors } from '../models';

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

export function validateDish(
  input: DishInput,
  existing: Dish[],
  categories: DishCategory[],
  editingId?: string,
): Errors {
  const e: Errors = {};
  const name = (input.BIT240201_Name ?? '').trim();

  if (!name) e.name = 'NAME_REQUIRED';
  if (!(Number(input.BIT240201_Price) > 0)) e.price = 'PRICE_INVALID';
  if (!(Number(input.BIT240201_PreparationTime) > 0)) e.time = 'TIME_INVALID';

  const catOk = categories.some((c) => c.BIT240201_Id === input.BIT240201_DishCategoryId);
  if (!catOk) e.category = 'CATEGORY_INVALID';

  if (name && catOk) {
    const dup = existing.some(
      (d) =>
        d.BIT240201_Id !== editingId &&
        d.BIT240201_DishCategoryId === input.BIT240201_DishCategoryId &&
        norm(d.BIT240201_Name) === norm(name),
    );
    if (dup) e.name = 'NAME_DUPLICATE';
  }
  return e;
}

export function validateCategory(name: string): Errors {
  return name.trim() ? {} : { name: 'NAME_REQUIRED' };
}