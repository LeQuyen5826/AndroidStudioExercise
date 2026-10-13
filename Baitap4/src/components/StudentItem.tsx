import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { Student } from '../types';
import Avatar from './Avatar';

type Props = {
  student: Student;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function StudentItem({ student, onPress, onEdit, onDelete }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Avatar uri={student.avatar} name={student.name} size={52} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {student.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {student.studentId}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {student.email}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.btn, { backgroundColor: '#E3F2FD' }]} onPress={onEdit} hitSlop={6}>
          <Ionicons name="pencil" size={18} color={colors.primary} />
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: '#FDECEA' }]} onPress={onDelete} hitSlop={6}>
          <Ionicons name="trash" size={18} color={colors.danger} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginLeft: 8 },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
