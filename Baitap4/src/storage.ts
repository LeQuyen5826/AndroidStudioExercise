import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from './types';

const KEY = '@students';

export async function getStudents(): Promise<Student[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Student[]) : [];
  } catch {
    return [];
  }
}

async function saveAll(list: Student[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const list = await getStudents();
  return list.find((s) => s.id === id);
}

export async function addStudent(data: Omit<Student, 'id'>): Promise<Student> {
  const list = await getStudents();
  const student: Student = { ...data, id: Date.now().toString() };
  await saveAll([student, ...list]);
  return student;
}

export async function updateStudent(student: Student): Promise<void> {
  const list = await getStudents();
  await saveAll(list.map((s) => (s.id === student.id ? student : s)));
}

export async function deleteStudent(id: string): Promise<void> {
  const list = await getStudents();
  await saveAll(list.filter((s) => s.id !== id));
}
