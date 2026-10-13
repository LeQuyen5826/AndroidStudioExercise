import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { uri?: string; name?: string; size?: number };

export default function Avatar({ uri, name = '', size = 56 }: Props) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.img, dim]} />;
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View style={[styles.placeholder, dim]}>
      <Text style={{ color: '#fff', fontSize: size / 2.4, fontWeight: '700' }}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: colors.border },
  placeholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
