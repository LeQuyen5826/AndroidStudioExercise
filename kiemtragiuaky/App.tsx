import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { FilterProvider } from './src/context/FilterContext';
import { LanguageProvider } from './src/i18n/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { seedIfEmpty } from './src/storage/seed';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty().then(() => setReady(true));
  }, []);

  if (!ready) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <LanguageProvider>
      <FilterProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FilterProvider>
    </LanguageProvider>
  );
}