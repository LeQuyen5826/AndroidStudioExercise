import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Khóa học" }} />
      <Stack.Screen
        name="course/[id]"
        options={{ title: "Chi tiết khóa học" }}
      />
      <Stack.Screen name="course/form" options={{ title: "Khóa học" }} />
      <Stack.Screen name="categories" options={{ title: "Quản lý danh mục" }} />
    </Stack>
  );
}
