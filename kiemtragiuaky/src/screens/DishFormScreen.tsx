import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useLang } from '../i18n/LanguageContext';
import { DishCategory, DishImage, Errors } from '../models';
import { RootStackParamList } from '../navigation/types';
import { listCategories } from '../services/categoryService';
import { createDish, getDish, updateDish } from '../services/dishService';

type Props = NativeStackScreenProps<RootStackParamList, 'DishForm'>;

export default function DishFormScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const { t, err } = useLang();

  const [categories, setCategories] = useState<DishCategory[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [missing, setMissing] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');
  const [available, setAvailable] = useState(true);
  const [desc, setDesc] = useState('');
  const [catId, setCatId] = useState('');
  const [images, setImages] = useState<DishImage[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    (async () => {
      setCategories(await listCategories());
      if (id) {
        const d = await getDish(id);
        if (!d) setMissing(true);
        else {
          setName(d.BIT240201_Name);
          setPrice(String(d.BIT240201_Price));
          setTime(String(d.BIT240201_PreparationTime));
          setAvailable(d.BIT240201_IsAvailable);
          setDesc(d.BIT240201_Description);
          setCatId(d.BIT240201_DishCategoryId);
          setImages(d.BIT240201_DishImages);
        }
      }
      setLoaded(true);
    })();
  }, [id]);

  const addImage = () => {
    const url = imageUrl.trim();
    if (!/^https?:\/\/\S+$/i.test(url)) {
      setImageError('IMAGE_URL_INVALID');
      return;
    }
    setImageError('');
    // Ảnh đầu tiên tự động là ảnh đại diện
    setImages((prev) => [...prev, { BIT240201_ImageUrl: url, BIT240201_IsThumbnail: prev.length === 0 }]);
    setImageUrl('');
  };

  // Đặt 1 ảnh là đại diện: các ảnh khác = false (tối đa 1 ảnh IsThumbnail = true)
  const setThumbnail = (index: number) =>
    setImages((prev) => prev.map((img, i) => ({ ...img, BIT240201_IsThumbnail: i === index })));

  const removeImage = (index: number) =>
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Xóa ảnh đại diện thì ảnh đầu tiên còn lại thành ảnh đại diện
      if (next.length > 0 && !next.some((i) => i.BIT240201_IsThumbnail)) {
        next[0] = { ...next[0], BIT240201_IsThumbnail: true };
      }
      return next;
    });

  const onSave = async () => {
    const input = {
      BIT240201_Name: name,
      BIT240201_Price: Number(price),
      BIT240201_PreparationTime: Number(time),
      BIT240201_IsAvailable: available,
      BIT240201_Description: desc,
      BIT240201_DishCategoryId: catId,
      BIT240201_DishImages: images,
    };
    const r = id ? await updateDish(id, input) : await createDish(input);
    if (!r.ok) {
      if (r.errors._) Alert.alert(err(r.errors._));
      setErrors(r.errors);
      return;
    }
    navigation.goBack();
  };

  if (!loaded) return null;
  if (missing) return <Text style={s.notFound}>{t('notFound')}</Text>;

  const fieldErr = (k: string) =>
    errors[k] ? <Text style={s.error}>{err(errors[k])}</Text> : null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={s.label}>{t('name')}</Text>
      <TextInput style={s.input} value={name} onChangeText={setName} />
      {fieldErr('name')}

      <Text style={s.label}>{t('price')}</Text>
      <TextInput style={s.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
      {fieldErr('price')}

      <Text style={s.label}>{t('prepTime')}</Text>
      <TextInput style={s.input} value={time} onChangeText={setTime} keyboardType="numeric" />
      {fieldErr('time')}

      <Text style={s.label}>{t('category')}</Text>
      <View style={s.chips}>
        {categories.map((c) => (
          <Pressable
            key={c.BIT240201_Id}
            onPress={() => setCatId(c.BIT240201_Id)}
            style={[s.chip, catId === c.BIT240201_Id && s.chipActive]}
          >
            <Text style={catId === c.BIT240201_Id ? s.chipTextActive : undefined}>
              {c.BIT240201_Name}
            </Text>
          </Pressable>
        ))}
      </View>
      {fieldErr('category')}

      <View style={s.switchRow}>
        <Text style={s.label}>{t('available')}</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>

      <Text style={s.label}>{t('description')}</Text>
      <TextInput style={[s.input, { height: 80 }]} value={desc} onChangeText={setDesc} multiline />

      <Text style={s.label}>{t('images')}</Text>
      <TextInput
        style={s.input}
        placeholder={t('imageUrl')}
        value={imageUrl}
        onChangeText={setImageUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {imageError ? <Text style={s.error}>{err(imageError)}</Text> : null}
      <View style={{ marginTop: 8 }}>
        <Button title={t('addImage')} onPress={addImage} />
      </View>

      {images.length === 0 ? (
        <Text style={s.muted}>{t('noImages')}</Text>
      ) : (
        images.map((img, i) => (
          <View key={`${img.BIT240201_ImageUrl}-${i}`} style={s.imgRow}>
            <Image source={{ uri: img.BIT240201_ImageUrl }} style={s.imgThumb} />
            <View style={{ flex: 1 }}>
              {img.BIT240201_IsThumbnail ? (
                <Text style={s.thumbBadge}>{t('thumbnail')}</Text>
              ) : (
                <Pressable onPress={() => setThumbnail(i)}>
                  <Text style={s.link}>{t('setThumbnail')}</Text>
                </Pressable>
              )}
            </View>
            <Pressable onPress={() => removeImage(i)}>
              <Text style={s.remove}>{t('remove')}</Text>
            </Pressable>
          </View>
        ))
      )}

      <View style={{ marginTop: 20 }}>
        <Button title={t('save')} onPress={onSave} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  notFound: { textAlign: 'center', marginTop: 40 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  error: { color: '#dc2626', marginTop: 4 },
  muted: { color: '#6b7280', marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  imgRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  imgThumb: { width: 56, height: 56, borderRadius: 6, backgroundColor: '#e5e7eb' },
  thumbBadge: { color: '#166534', fontWeight: '700' },
  link: { color: '#2563eb' },
  remove: { color: '#dc2626' },
});