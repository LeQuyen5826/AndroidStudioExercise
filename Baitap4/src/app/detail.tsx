// TRANG 2: Thông tin chi tiết sinh viên (chỉ xem)
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import { useI18n } from '../i18n';
import { getStudent } from '../storage';
import { colors } from '../theme';
import { Student } from '../types';

export default function StudentDetailScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      if (id) getStudent(id).then((s) => setStudent(s ?? null));
    }, [id]),
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title={t('info')} showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {student === null && <Text style={styles.empty}>{t('notFound')}</Text>}
        {student && (
          <>
            <View style={styles.avatarWrap}>
              <Avatar uri={student.avatar} name={student.name} size={120} />
            </View>
            <View style={styles.card}>
              <Row label={t('fullName')} value={student.name} />
              <Row label={t('studentId')} value={student.studentId} />
              <Row label={t('email')} value={student.email} />
            </View>
          </>
        )}
      </ScrollView>

      {/* Nút Thêm */}
      <View style={styles.footer}>
        <Pressable style={styles.addBtn} onPress={() => router.push('/edit')}>
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addText}>{t('add')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 48 },
  avatarWrap: { alignItems: 'center', marginVertical: 20 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 16 },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 13, color: colors.muted },
  value: { fontSize: 17, color: colors.text, marginTop: 4, fontWeight: '600' },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
