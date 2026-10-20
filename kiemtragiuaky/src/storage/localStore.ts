import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage là key-value: mỗi "bảng" là 1 key chứa mảng JSON.
export async function readTable<T>(table: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(table);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function writeTable<T>(table: string, rows: T[]): Promise<void> {
  await AsyncStorage.setItem(table, JSON.stringify(rows));
}

export async function tableExists(table: string): Promise<boolean> {
  return (await AsyncStorage.getItem(table)) !== null;
}