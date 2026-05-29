import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
 
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { token, isLoadingAuth } = useAuthStore();
 
  useEffect(() => {
    if (isLoadingAuth) return;
 
    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'task';
    const inPublicGroup = segments[0] === 'login' || segments[0] === 'signup';
 
    if (!token && inAuthGroup) {
      router.replace('/login');
    } else if (token && inPublicGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isLoadingAuth, segments]);
 
  return <>{children}</>;
}
 
export default function RootLayout() {
  const loadAuthFromStorage = useAuthStore((state) => state.loadAuthFromStorage);
 
  useEffect(() => {
    loadAuthFromStorage();
  }, []);
 
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
 
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="task/[id]"
          options={{
            title: 'Detalhe da Tarefa',
            headerBackTitle: 'Voltar',
          }}
        />
      </Stack>
    </AuthGuard>
  );
}