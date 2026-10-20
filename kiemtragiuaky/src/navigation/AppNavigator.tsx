import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import { MSSV } from '../config/student';
import { useLang } from '../i18n/LanguageContext';
import DishDetailScreen from '../screens/DishDetailScreen';
import DishFormScreen from '../screens/DishFormScreen';
import DishListScreen from '../screens/DishListScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { t, lang, setLang } = useLang();

  return (
    <Stack.Navigator
      screenOptions={{
        // Nút đổi ngôn ngữ luôn hiện ở mọi màn hình
        headerRight: () => (
          <Pressable onPress={() => setLang(lang === 'en' ? 'vi' : 'en')}>
            <Text style={{ fontWeight: '700', color: '#2563eb' }}>
              {lang === 'en' ? 'VI' : 'EN'}
            </Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="DishList"
        component={DishListScreen}
        options={{ title: `${MSSV} - ${t('dishes')}` }}
      />
      <Stack.Screen
        name="DishDetail"
        component={DishDetailScreen}
        options={{ title: t('dishDetail') }}
      />
      <Stack.Screen
        name="DishForm"
        component={DishFormScreen}
        options={({ route }) => ({
          title: route.params?.id ? t('editDish') : t('addDish'),
        })}
      />
    </Stack.Navigator>
  );
}