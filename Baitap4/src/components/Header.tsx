import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Language, useI18n } from '../i18n';
import { colors } from '../theme';

type Props = {
  title: string;
  showBack?: boolean;
};

export default function Header({ title, showBack }: Props) {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const options: { value: Language; label: string }[] = [
    { value: 'auto', label: t('langAuto') },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' },
  ];

  return (
    <View style={styles.header}>
      {/* Góc trên bên trái: mũi tên quay lại (trang 2, 3) */}
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Image source={require('../../assets/arrow.png')} style={styles.icon} />
          </Pressable>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Góc trên bên phải: nút Settings (tất cả các trang) */}
      <View style={[styles.side, { alignItems: 'flex-end' }]}>
        <Pressable onPress={() => setOpen(true)} hitSlop={12}>
          <Image source={require('../../assets/settings.png')} style={styles.icon} />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>
              {t('settings')} - {t('language')}
            </Text>
            {options.map((o) => (
              <Pressable
                key={o.value}
                style={styles.option}
                onPress={() => {
                  setLang(o.value);
                  setOpen(false);
                }}>
                <Text style={styles.optionText}>{o.label}</Text>
                <Ionicons
                  name={lang === o.value ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  side: { width: 40 },
  icon: { width: 24, height: 24, resizeMode: 'contain' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 32,
  },
  sheet: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  optionText: { fontSize: 16, color: colors.text },
});
