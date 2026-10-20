import { Filters } from '../context/FilterContext';
import { Dish } from '../models';

export function applyFilters(dishes: Dish[], f: Filters): { list: Dish[]; priceError: boolean } {
  const parse = (s: string) => (s.trim() === '' ? null : Number(s));
  const min = parse(f.minPrice);
  const max = parse(f.maxPrice);
  const bad = (v: number | null) => v !== null && (Number.isNaN(v) || v < 0);
  // Khoảng giá không hợp lệ: không phải số, số âm, hoặc min > max
  const priceError = bad(min) || bad(max) || (min !== null && max !== null && min > max);

  const q = f.search.trim().toLowerCase();

  const list = dishes.filter((d) => {
    if (q && !d.BIT240201_Name.toLowerCase().includes(q)) return false;
    if (f.categoryId && d.BIT240201_DishCategoryId !== f.categoryId) return false;
    if (f.onlyAvailable && !d.BIT240201_IsAvailable) return false;
    if (!priceError) {
      if (min !== null && d.BIT240201_Price < min) return false;
      if (max !== null && d.BIT240201_Price > max) return false;
    }
    return true;
  });

  if (f.sort === 'priceAsc') list.sort((a, b) => a.BIT240201_Price - b.BIT240201_Price);
  if (f.sort === 'priceDesc') list.sort((a, b) => b.BIT240201_Price - a.BIT240201_Price);
  if (f.sort === 'timeAsc') list.sort((a, b) => a.BIT240201_PreparationTime - b.BIT240201_PreparationTime);

  return { list, priceError };
}