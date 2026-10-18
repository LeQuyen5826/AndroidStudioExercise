import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  Text,
  View,
} from "react-native";
import { api } from "../../api";
import { ErrorView, Loading } from "../../components/State";
import { Course } from "../../types";

function Trailer({ url, onClose }: { url: string; onClose: () => void }) {
  const player = useVideoPlayer(url, (p) => {
    p.play();
  });
  return (
    <View
      style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}
    >
      <VideoView
        player={player}
        style={{ width: "100%", height: 260 }}
        nativeControls
        fullscreenOptions={{ enable: true }}
      />
      <View style={{ margin: 20 }}>
        <Button title="Đóng" onPress={onClose} />
      </View>
    </View>
  );
}

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [catName, setCatName] = useState("");
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const load = useCallback(async () => {
    try {
      setError("");
      const c = await api.getCourse(id);
      const cats = await api.getCategories();
      setCourse(c);
      setCatName(
        cats.find((x) => x.id === c.categoryId)?.name ?? "Không xác định",
      );
    } catch (e: any) {
      setError(e.message);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const confirmDelete = () =>
    Alert.alert("Xóa khóa học", "Bạn chắc chắn muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteCourse(id);
            router.back();
          } catch (e: any) {
            Alert.alert("Lỗi", e.message);
          }
        },
      },
    ]);

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!course) return <Loading />;

  return (
    <ScrollView>
      <Image
        source={{ uri: course.thumbnail }}
        style={{ width: "100%", height: 220, backgroundColor: "#ddd" }}
      />
      <View style={{ padding: 16, gap: 6 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>{course.title}</Text>
        <Text>Danh mục: {catName}</Text>
        <Text>Giảng viên: {course.instructor}</Text>
        <Text>Thời lượng: {course.duration} giờ</Text>
        <Text>Học phí: {course.price.toLocaleString("vi-VN")} đ</Text>
        <Text>Ngày tạo: {course.createdAt}</Text>
        <Text style={{ marginTop: 8 }}>{course.description}</Text>
        <View style={{ gap: 8, marginTop: 16 }}>
          <Button title="Xem trailer" onPress={() => setShowTrailer(true)} />
          <Button
            title="Sửa"
            onPress={() =>
              router.push({ pathname: "/course/form", params: { id } })
            }
          />
          <Button title="Xóa" color="crimson" onPress={confirmDelete} />
        </View>
      </View>
      <Modal
        visible={showTrailer}
        animationType="slide"
        onRequestClose={() => setShowTrailer(false)}
      >
        <Trailer
          url={course.trailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      </Modal>
    </ScrollView>
  );
}
