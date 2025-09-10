import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClientProvider } from '@tanstack/react-query';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { AuthProvider } from '@/contexts/AuthContext';
import '../global.css';
import { queryClient } from '@/services/queryClient';

export default function RootLayout() {
  useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GluestackUIProvider config={config}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" networkActivityIndicatorVisible={false} />
        </GluestackUIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
