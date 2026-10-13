// TRANG 3: Thêm mới / Sửa thông tin sinh viên
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import Header from "../components/Header";
import { showMessage } from "../dialog";
import { TKey, useI18n } from "../i18n";
import { addStudent, getStudent, getStudents, updateStudent } from "../storage";
import { colors } from "../theme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<typeof TextInput>, "onChange">) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={colors.muted}
        {...rest}
      />
    </View>
  );
}

export default function StudentEditScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!id) return;
    getStudent(id).then((s) => {
      if (!s) return;
      setName(s.name);
      setStudentId(s.studentId);
      setEmail(s.email);
      setAvatar(s.avatar);
    });
  }, [id]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showMessage(t("appName"), t("errPermission"));
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!res.canceled && res.assets[0]) {
      const a = res.assets[0];
      // Lưu dạng data URI để ảnh không bị mất khi cache của hệ thống bị dọn
      setAvatar(a.base64 ? `data:image/jpeg;base64,${a.base64}` : a.uri);
    }
  };

  const validate = async (): Promise<string | null> => {
    const required: [string, TKey][] = [
      [name, "fullName"],
      [studentId, "studentId"],
      [email, "email"],
    ];
    for (const [value, key] of required) {
      if (!value.trim())
        return t("errRequired", { field: t(key).toLowerCase() });
    }
    if (!EMAIL_RE.test(email.trim())) return t("errEmail");
    const list = await getStudents();
    const dup = list.some(
      (s) => s.studentId === studentId.trim() && s.id !== id,
    );
    if (dup) return t("errDuplicate");
    return null;
  };

  const doSave = async () => {
    const data = {
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
    };
    try {
      if (isEdit && id) await updateStudent({ id, ...data });
      else await addStudent(data);
      // Lưu xong -> quay về trang danh sách
      if (router.canDismiss()) router.dismissAll();
      else router.replace("/");
    } catch {
      showMessage(t("appName"), t("errSave"));
    }
  };

  const onSave = async () => {
    const err = await validate();
    if (err) {
      showMessage(t("appName"), err);
      return;
    }
    doSave();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header title={t("info")} showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarWrap}>
            <Avatar uri={avatar} name={name} size={110} />
            <Pressable style={styles.pickBtn} onPress={pickImage}>
              <Ionicons name="image" size={18} color={colors.primary} />
              <Text style={styles.pickText}>{t("pickImage")}</Text>
            </Pressable>
          </View>

          <Field
            label={t("avatarUrl")}
            value={avatar.startsWith("data:") ? "" : avatar}
            onChange={setAvatar}
            autoCapitalize="none"
            placeholder="https://..."
          />
          <Field label={t("fullName")} value={name} onChange={setName} />
          <Field
            label={t("studentId")}
            value={studentId}
            onChange={setStudentId}
            autoCapitalize="characters"
          />
          <Field
            label={t("email")}
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Nút Lưu ở cuối màn hình */}
      <View style={styles.footer}>
        <Pressable style={styles.saveBtn} onPress={onSave}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveText}>{t("save")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16 },
  avatarWrap: { alignItems: "center", marginBottom: 16 },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
  },
  pickText: { color: colors.primary, fontWeight: "600" },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
