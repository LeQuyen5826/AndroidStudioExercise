export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete';

export interface DishImage {
  BIT240201_ImageUrl: string;
  BIT240201_IsThumbnail: boolean;
}

export interface DishCategory {
  BIT240201_Id: string;
  BIT240201_Name: string;
  BIT240201_Description: string;
  BIT240201_UpdatedAt: number;
  BIT240201_SyncStatus: SyncStatus;
  BIT240201_RemoteId?: string; // id do MockAPI cấp
}

export interface Dish {
  BIT240201_Id: string;
  BIT240201_Name: string;
  BIT240201_Price: number;
  BIT240201_PreparationTime: number;
  BIT240201_IsAvailable: boolean;
  BIT240201_Description: string;
  BIT240201_DishCategoryId: string;
  BIT240201_DishImages: DishImage[];
  BIT240201_UpdatedAt: number;
  BIT240201_SyncStatus: SyncStatus;
  BIT240201_RemoteId?: string;
}

export type DishInput = Omit<
  Dish,
  'BIT240201_Id' | 'BIT240201_UpdatedAt' | 'BIT240201_SyncStatus' | 'BIT240201_RemoteId'
>;
export type CategoryInput = Omit<
  DishCategory,
  'BIT240201_Id' | 'BIT240201_UpdatedAt' | 'BIT240201_SyncStatus' | 'BIT240201_RemoteId'
>;

// Lỗi trả về là mã (code), UI sẽ tra từ điển en/vi để hiển thị.
export type Errors = Record<string, string>;
export type Result<T> = { ok: true; data: T } | { ok: false; errors: Errors };