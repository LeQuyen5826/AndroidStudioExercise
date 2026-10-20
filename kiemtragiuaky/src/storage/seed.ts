import { TABLE_CATEGORY, TABLE_DISH } from '../config/student';
import { Dish, DishCategory } from '../models';
import { tableExists, writeTable } from './localStore';

const cat = (id: string, name: string, desc: string): DishCategory => ({
  BIT240201_Id: id,
  BIT240201_Name: name,
  BIT240201_Description: desc,
  BIT240201_UpdatedAt: Date.now(),
  BIT240201_SyncStatus: 'pending_create',
});

const dish = (
  id: string, name: string, price: number, time: number, avail: boolean,
  desc: string, catId: string, seeds: string[],
): Dish => ({
  BIT240201_Id: id,
  BIT240201_Name: name,
  BIT240201_Price: price,
  BIT240201_PreparationTime: time,
  BIT240201_IsAvailable: avail,
  BIT240201_Description: desc,
  BIT240201_DishCategoryId: catId,
  BIT240201_DishImages: seeds.map((s, i) => ({
    BIT240201_ImageUrl: `https://picsum.photos/seed/${s}/600/400`,
    BIT240201_IsThumbnail: i === 0,
  })),
  BIT240201_UpdatedAt: Date.now(),
  BIT240201_SyncStatus: 'pending_create',
});

export async function seedIfEmpty() {
  if (await tableExists(TABLE_CATEGORY)) return;

  await writeTable<DishCategory>(TABLE_CATEGORY, [
    cat('seed-cat-1', 'Main course', 'Rice, noodles and main dishes'),
    cat('seed-cat-2', 'Dessert', 'Sweet dishes'),
    cat('seed-cat-3', 'Drink', 'Beverages'),
  ]);

  await writeTable<Dish>(TABLE_DISH, [
    dish('seed-dish-1', 'Beef pho', 55000, 12, true, 'Hanoi beef noodle soup', 'seed-cat-1', ['pho1', 'pho2']),
    dish('seed-dish-2', 'Grilled pork rice', 45000, 20, true, 'Broken rice with grilled pork', 'seed-cat-1', ['rice1']),
    dish('seed-dish-3', 'Flan', 15000, 5, true, 'Caramel custard', 'seed-cat-2', ['flan1', 'flan2']),
    dish('seed-dish-4', 'Milk tea', 25000, 8, true, 'Classic milk tea', 'seed-cat-3', ['tea1']),
    dish('seed-dish-5', 'Iced coffee', 20000, 6, false, 'Vietnamese iced coffee (out of stock)', 'seed-cat-3', ['coffee1', 'coffee2']),
  ]);
}