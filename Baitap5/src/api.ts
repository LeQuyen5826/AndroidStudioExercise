import { Category, Course, CourseInput } from "./types";

export const BASE_URL = "https://6ace45d2f338359cf1c35f99.mockapi.io/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => request<Category[]>("/categories"),
  addCategory: (c: Omit<Category, "id">) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(c),
    }),
  updateCategory: (id: string, c: Omit<Category, "id">) =>
    request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(c),
    }),
  deleteCategory: (id: string) =>
    request<Category>(`/categories/${id}`, { method: "DELETE" }),

  getCourses: () => request<Course[]>("/courses"),
  getCourse: (id: string) => request<Course>(`/courses/${id}`),
  addCourse: (c: CourseInput) =>
    request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify({
        ...c,
        createdAt: new Date().toISOString().slice(0, 10),
      }),
    }),
  updateCourse: (id: string, c: CourseInput) =>
    request<Course>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(c),
    }),
  deleteCourse: (id: string) =>
    request<Course>(`/courses/${id}`, { method: "DELETE" }),
};
