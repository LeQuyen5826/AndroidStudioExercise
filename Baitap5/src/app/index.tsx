import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../api";
import { Empty, ErrorView, Loading } from "../components/State";
import { Category, Course } from "../types";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filterId, setFilterId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError("");
      const [cs, cats] = await Promise.all([
        api.getCourses(),
        api.getCategories(),
      ]);
      setCourses(cs);
      setCategories(cats);
    } catch (e: any) {
      setError(e.message ?? "Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const catName = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const data = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(keyword.trim().toLowerCase()) &&
          (!filterId || c.categoryId === filterId),
      ),
    [courses, keyword, filterId],
  );

  if (loading) return <Loading />;
  if (error)
    return (
      <ErrorView
        message={error}
        onRetry={() => {
          setLoading(true);
          load();
        }}
      />
    );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Text
              onPress={() => router.push("/categories")}
              style={{ color: "#0a84ff" }}
            >
              Danh mục
            </Text>
          ),
        }}
      />
      <TextInput
        placeholder="Tìm theo tên khóa học..."
        value={keyword}
        onChangeText={setKeyword}
        style={{
          margin: 12,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
        }}
      />
      <View style={{ height: 44 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          {[{ id: null, name: "Tất cả" }, ...categories].map((c) => (
            <Pressable
              key={c.id ?? "all"}
              onPress={() => setFilterId(c.id)}
              style={{
                paddingHorizontal: 14,
                justifyContent: "center",
                borderRadius: 18,
                backgroundColor: filterId === c.id ? "#0a84ff" : "#e8e8e8",
              }}
            >
              <Text style={{ color: filterId === c.id ? "#fff" : "#333" }}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        ListEmptyComponent={<Empty text="Không có khóa học nào" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/course/${item.id}`)}
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 10,
              overflow: "hidden",
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 100, height: 100, backgroundColor: "#ddd" }}
            />
            <View style={{ flex: 1, padding: 10, gap: 2 }}>
              <Text style={{ fontWeight: "700" }} numberOfLines={2}>
                {item.title}
              </Text>
              <Text>{item.instructor}</Text>
              <Text style={{ color: "#666" }}>
                {catName[item.categoryId] ?? "—"}
              </Text>
              <Text style={{ color: "#d9480f", fontWeight: "600" }}>
                {item.price.toLocaleString("vi-VN")} đ
              </Text>
            </View>
          </Pressable>
        )}
      />
      <Pressable
        onPress={() => router.push("/course/form")}
        style={{
          position: "absolute",
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#0a84ff",
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
      </Pressable>
    </View>
  );
}
