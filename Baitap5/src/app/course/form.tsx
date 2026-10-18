import { Picker } from "@react-native-picker/picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../../api";
import { Loading } from "../../components/State";
import { Category } from "../../types";

const empty = {
  title: "",
  description: "",
  categoryId: "",
  instructor: "",
  price: "",
  duration: "",
  thumbnail: "",
  trailerUrl: "",
};

export default function CourseForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [f, setF] = useState(empty);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof empty) => (v: string) =>
    setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const categories = await api.getCategories();
        setCats(categories);
        if (id) {
          const c = await api.getCourse(id);
          setF({ ...c, price: String(c.price), duration: String(c.duration) });
        } else if (categories.length) {
          setF((p) => ({ ...p, categoryId: categories[0].id }));
        }
      } catch (e: any) {
        Alert.alert("Lỗi", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const validate = (): string | null => {
    if (!f.title.trim() || !f.instructor.trim() || !f.description.trim())
      return "Vui lòng nhập tên, mô tả và giảng viên";
    if (!cats.some((c) => c.id === f.categoryId))
      return "Danh mục không tồn tại";
    const price = Number(f.price),
      duration = Number(f.duration);
    if (f.price === "" || isNaN(price) || price < 0)
      return "Học phí phải là số không âm";
    if (f.duration === "" || isNaN(duration) || duration <= 0)
      return "Thời lượng phải lớn hơn 0";
    if (!/^https?:\/\//.test(f.thumbnail)) return "URL ảnh bìa không hợp lệ";
    if (!/^https?:\/\//.test(f.trailerUrl)) return "URL trailer không hợp lệ";
    return null;
  };

  const save = async () => {
    const err = validate();
    if (err) return Alert.alert("Dữ liệu chưa hợp lệ", err);
    setSaving(true);
    try {
      const body = {
        ...f,
        price: Number(f.price),
        duration: Number(f.duration),
      };
      if (id) await api.updateCourse(id, body);
      else await api.addCourse(body);
      router.back();
    } catch (e: any) {
      Alert.alert("Lỗi", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  const input = {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Stack.Screen
        options={{ title: id ? "Sửa khóa học" : "Thêm khóa học" }}
      />
      <TextInput
        style={input}
        placeholder="Tên khóa học"
        value={f.title}
        onChangeText={set("title")}
      />
      <TextInput
        style={[input, { height: 80 }]}
        multiline
        placeholder="Mô tả"
        value={f.description}
        onChangeText={set("description")}
      />
      <TextInput
        style={input}
        placeholder="Giảng viên"
        value={f.instructor}
        onChangeText={set("instructor")}
      />
      <Text>Danh mục</Text>
      <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
        <Picker selectedValue={f.categoryId} onValueChange={set("categoryId")}>
          {cats.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={input}
        placeholder="Học phí (VNĐ)"
        keyboardType="numeric"
        value={f.price}
        onChangeText={set("price")}
      />
      <TextInput
        style={input}
        placeholder="Thời lượng (giờ)"
        keyboardType="numeric"
        value={f.duration}
        onChangeText={set("duration")}
      />
      <TextInput
        style={input}
        placeholder="URL ảnh bìa"
        autoCapitalize="none"
        value={f.thumbnail}
        onChangeText={set("thumbnail")}
      />
      {!!f.thumbnail && (
        <Image
          source={{ uri: f.thumbnail }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 8,
            backgroundColor: "#eee",
          }}
          resizeMode="cover"
        />
      )}
      <TextInput
        style={input}
        placeholder="URL trailer (MP4)"
        autoCapitalize="none"
        value={f.trailerUrl}
        onChangeText={set("trailerUrl")}
      />
      <Button
        title={saving ? "Đang lưu..." : "Lưu"}
        onPress={save}
        disabled={saving}
      />
    </ScrollView>
  );
}
