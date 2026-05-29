import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
 
interface User {
  id: string;
  name: string;
  email: string;
}
 
interface AuthState {
  token: string | null;
  user: User | null;
  isLoadingAuth: boolean;
 
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuthFromStorage: () => Promise<void>;
}
 
const TOKEN_KEY = 'sessionToken';
const USER_KEY = 'sessionUser';
 
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoadingAuth: true,
 
  setAuth: async (token, user) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
 
  clearAuth: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ token: null, user: null });
  },
 
  loadAuthFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userRaw = await SecureStore.getItemAsync(USER_KEY);
      if (token && userRaw) {
        set({ token, user: JSON.parse(userRaw), isLoadingAuth: false });
      } else {
        set({ isLoadingAuth: false });
      }
    } catch {
      set({ isLoadingAuth: false });
    }
  },
}));