import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { useLang } from '../i18n/LanguageContext';
import { Dish } from '../models';
import { RootStackParamList } from '../navigation/types';
import { listCategories } from '../services/categoryService';
import { deleteDish, getDish } from '../services/dishService';
import { formatPrice, isQuick } from '../utils/dish';

type Props = NativeStackScreenProps<RootStackParamList, 'DishDetail'>;

export default function DishDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { t, err } = useLang();
  const [dish, setDish] = useState<Dish | null>(null);
  const [catName, setCatName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const d = await getDish(id);
        setDish(d);
        if (d) {
          const cats = await listCategories();
          setCatName(cats.find((c) => c.BIT240201_Id === d.BIT240201_DishCategoryId)?.BIT240201_Name ?? '');
        }
        setLoaded(true);
      })();
    }, [id]),
  );

  const confirmDelete = () => {
    Alert.alert(t('confirmDeleteTitle'), t('confirmDeleteMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          const r = await deleteDish(id);
          if (r.ok) navigation.goBack();
          else Alert.alert(err(r.errors._ ?? 'NOT_FOUND'));
        },
      },
    ]);
  };

  if (!loaded) return null;
  if (!dish) return <Text style={s.notFound}>{t('notFound')}</Text>; // Id không tồn tại

  const images = dish.BIT240201_DishImages;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {images.length === 0 ? (
        <Text style={s.muted}>{t('noImages')}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, i) => (
            <Image key={i} source={{ uri: img.BIT240201_ImageUrl }} style={s.img} />
          ))}
        </ScrollView>
      )}

      <Text style={s.title}>{dish.BIT240201_Name}</Text>
      <Text style={s.price}>{formatPrice(dish.BIT240201_Price)}</Text>

      <Text style={s.line}>{t('category')}: {catName}</Text>
      <Text style={s.line}>
        {t('prepTime')}: {dish.BIT240201_PreparationTime} ({isQuick(dish) ? t('quick') : t('regular')})
      </Text>
      <Text style={s.line}>
        {dish.BIT240201_IsAvailable ? t('available') : t('unavailable')}
      </Text>
      <Text style={s.line}>{t('description')}: {dish.BIT240201_Description}</Text>

      <View style={s.actions}>
        <Button title={t('edit')} onPress={() => navigation.navigate('DishForm', { id })} />
        <Button title={t('delete')} color="#dc2626" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  notFound: { textAlign: 'center', marginTop: 40 },
  muted: { color: '#6b7280', marginBottom: 8 },
  img: { width: 260, height: 180, borderRadius: 10, marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  price: { fontSize: 18, color: '#2563eb', marginVertical: 4 },
  line: { fontSize: 15, marginTop: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
});