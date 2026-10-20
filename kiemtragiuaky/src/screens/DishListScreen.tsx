import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SortKey, useFilters } from '../context/FilterContext';
import { useLang } from '../i18n/LanguageContext';
import { Dish, DishCategory } from '../models';
import { RootStackParamList } from '../navigation/types';
import { listCategories } from '../services/categoryService';
import { listDishes } from '../services/dishService';
import { formatPrice, getThumbnail, isQuick } from '../utils/dish';
import { applyFilters } from '../utils/filter';

type Props = NativeStackScreenProps<RootStackParamList, 'DishList'>;

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={active ? s.chipTextActive : undefined}>{label}</Text>
    </Pressable>
  );
}

export default function DishListScreen({ navigation }: Props) {
  const { t, err } = useLang();
  const { filters, setFilters, reset } = useFilters();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<DishCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      listDishes().then(setDishes);
      listCategories().then(setCategories);
    }, []),
  );

  const { list, priceError } = useMemo(() => applyFilters(dishes, filters), [dishes, filters]);

  const sorts: { key: SortKey; label: string }[] = [
    { key: 'none', label: t('sortDefault') },
    { key: 'priceAsc', label: t('sortPriceAsc') },
    { key: 'priceDesc', label: t('sortPriceDesc') },
    { key: 'timeAsc', label: t('sortTimeAsc') },
  ];

  const panel = (
    <View style={s.panel}>
      <TextInput
        style={s.input}
        placeholder={t('search')}
        value={filters.search}
        onChangeText={(v) => setFilters({ search: v })}
      />

      <View style={s.chips}>
        <Chip label={t('all')} active={filters.categoryId === ''} onPress={() => setFilters({ categoryId: '' })} />
        {categories.map((c) => (
          <Chip
            key={c.BIT240201_Id}
            label={c.BIT240201_Name}
            active={filters.categoryId === c.BIT240201_Id}
            onPress={() => setFilters({ categoryId: c.BIT240201_Id })}
          />
        ))}
      </View>

      <View style={s.row}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder={t('minPrice')}
          keyboardType="numeric"
          value={filters.minPrice}
          onChangeText={(v) => setFilters({ minPrice: v })}
        />
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder={t('maxPrice')}
          keyboardType="numeric"
          value={filters.maxPrice}
          onChangeText={(v) => setFilters({ maxPrice: v })}
        />
      </View>
      {priceError && <Text style={s.error}>{err('PRICE_RANGE_INVALID')}</Text>}

      <View style={s.switchRow}>
        <Text>{t('onlyAvailable')}</Text>
        <Switch value={filters.onlyAvailable} onValueChange={(v) => setFilters({ onlyAvailable: v })} />
      </View>

      <View style={s.chips}>
        {sorts.map((o) => (
          <Chip key={o.key} label={o.label} active={filters.sort === o.key} onPress={() => setFilters({ sort: o.key })} />
        ))}
      </View>

      <Pressable onPress={reset}>
        <Text style={s.clear}>{t('clearFilters')}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={s.container}>
      <FlatList
        data={list}
        keyExtractor={(d) => d.BIT240201_Id}
        ListHeaderComponent={panel}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={s.empty}>{dishes.length === 0 ? t('empty') : t('noResults')}</Text>
        }
        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        renderItem={({ item }) => {
          const thumb = getThumbnail(item);
          return (
            <Pressable
              style={s.card}
              onPress={() => navigation.navigate('DishDetail', { id: item.BIT240201_Id })}
            >
              {thumb ? (
                <Image source={{ uri: thumb }} style={s.thumb} />
              ) : (
                <View style={[s.thumb, s.noThumb]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.BIT240201_Name}</Text>
                <Text>{formatPrice(item.BIT240201_Price)}</Text>
                <View style={s.badges}>
                  <Text style={[s.badge, isQuick(item) ? s.quick : s.regular]}>
                    {isQuick(item) ? t('quick') : t('regular')}
                  </Text>
                  <Text style={item.BIT240201_IsAvailable ? s.ok : s.off}>
                    {item.BIT240201_IsAvailable ? t('available') : t('unavailable')}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      <Pressable style={s.fab} onPress={() => navigation.navigate('DishForm', {})}>
        <Text style={s.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  panel: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 12, gap: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 8, backgroundColor: '#fff' },
  row: { flexDirection: 'row', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  error: { color: '#dc2626' },
  clear: { color: '#2563eb', fontWeight: '600', textAlign: 'right' },
  empty: { textAlign: 'center', marginTop: 40, color: '#6b7280' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10, gap: 10 },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  noThumb: { backgroundColor: '#d1d5db' },
  name: { fontSize: 16, fontWeight: '600' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 12, overflow: 'hidden' },
  quick: { backgroundColor: '#dcfce7', color: '#166534' },
  regular: { backgroundColor: '#e5e7eb', color: '#374151' },
  ok: { color: '#16a34a', fontSize: 12 },
  off: { color: '#dc2626', fontSize: 12 },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#fff', fontSize: 30, marginTop: -2 },
});