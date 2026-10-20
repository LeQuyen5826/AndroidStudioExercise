import { Dish } from '../models';

export const getThumbnail = (d: Dish): string | undefined =>
  (d.BIT240201_DishImages.find((i) => i.BIT240201_IsThumbnail) ?? d.BIT240201_DishImages[0])
    ?.BIT240201_ImageUrl;

// Phân loại tính lúc hiển thị, không lưu vào dữ liệu
export const isQuick = (d: Dish) => d.BIT240201_PreparationTime <= 15;

export const formatPrice = (n: number) => `${Number(n).toLocaleString('en-US')}đ`;