import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../api";
import { Empty, ErrorView, Loading } from "../components/State";
import { Category } from "../types";

export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setItems(await api.getCategories());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const reset = () => {
    setEditing(null);
    setName("");
    setDesc("");
  };

  const submit = async () => {
    if (!name.trim())
      return Alert.alert("Lỗi", "Tên danh mục không được trống");
    try {
      const body = { name: name.trim(), description: desc.trim() };
      if (editing) await api.updateCategory(editing.id, body);
      else await api.addCategory(body);
      reset();
      load();
    } catch (e: any) {
      Alert.alert("Lỗi", e.message);
    }
  };

  const remove = async (c: Category) => {
    try {
      const courses = await api.getCourses();
      if (courses.some((x) => x.categoryId === c.id))
        return Alert.alert("Không thể xóa", "Danh mục đang có khóa học.");
      Alert.alert("Xóa danh mục", `Xóa "${c.name}"?`, [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteCategory(c.id);
              load();
            } catch (e: any) {
              Alert.alert("Lỗi", e.message);
            }
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert("Lỗi", e.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={load} />;
  const input = {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, gap: 8 }}>
        <TextInput
          style={input}
          placeholder="Tên danh mục"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={input}
          placeholder="Mô tả"
          value={desc}
          onChangeText={setDesc}
        />
        <Button
          title={editing ? "Cập nhật" : "Thêm danh mục"}
          onPress={submit}
        />
        {editing && <Button title="Hủy sửa" color="gray" onPress={reset} />}
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Empty text="Chưa có danh mục" />}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderTopWidth: 1,
              borderColor: "#eee",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700" }}>{item.name}</Text>
              <Text style={{ color: "#666" }}>{item.description}</Text>
            </View>
            <Pressable
              onPress={() => {
                setEditing(item);
                setName(item.name);
                setDesc(item.description);
              }}
            >
              <Text style={{ color: "#0a84ff", marginRight: 16 }}>Sửa</Text>
            </Pressable>
            <Pressable onPress={() => remove(item)}>
              <Text style={{ color: "crimson" }}>Xóa</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
