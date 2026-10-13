// TRANG 1: Danh sách sinh viên
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import StudentItem from "../components/StudentItem";
import { confirmDialog } from "../dialog";
import { useI18n } from "../i18n";
import { deleteStudent, getStudents } from "../storage";
import { colors } from "../theme";
import { Student } from "../types";

export default function StudentListScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);

  const load = useCallback(async () => {
    setStudents(await getStudents());
  }, []);

  // Tải lại danh sách mỗi khi quay về trang 1
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const confirmDelete = (s: Student) => {
    confirmDialog(
      t("confirm"),
      t("confirmDelete"),
      t("yes"),
      t("no"),
      async () => {
        await deleteStudent(s.id);
        load();
      },
    );
  };

  // Bấm nút sửa -> hỏi xác nhận, chọn "Có" mới mở trang 3
  const confirmEdit = (s: Student) => {
    confirmDialog(t("confirm"), t("confirmEdit"), t("yes"), t("no"), () =>
      router.push({ pathname: "/edit", params: { id: s.id } }),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header title={t("appName")} />

      <FlatList
        data={students}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{t("emptyList")}</Text>}
        renderItem={({ item }) => (
          <StudentItem
            student={item}
            onPress={() =>
              router.push({ pathname: "/detail", params: { id: item.id } })
            }
            onEdit={() => confirmEdit(item)}
            onDelete={() => confirmDelete(item)}
          />
        )}
      />

      {/* Nút Thêm ở cuối màn hình */}
      <View style={styles.footer}>
        <Pressable style={styles.addBtn} onPress={() => router.push("/edit")}>
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addText}>{t("add")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, flexGrow: 1 },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 48,
    fontSize: 15,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
