import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/data';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DataProvider>
          <AuthProvider>
            <RootNavigator />
            <StatusBar style="dark" />
          </AuthProvider>
        </DataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
