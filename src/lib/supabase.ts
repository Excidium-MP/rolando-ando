import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Sessions need a different storage backend per environment:
// - Native (iOS / Android):    expo-secure-store (Keychain / Keystore)
// - Browser:                   AsyncStorage (-> localStorage)
// - Node at build time (SSR):  in-memory, since localStorage does not exist
//                              and there is no "user" to persist a session
//                              for anyway during static pre-render.

const ExpoSecureStoreAdapter: SupportedStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

const memoryStorage: SupportedStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      store.set(key, value);
    },
    removeItem: async (key) => {
      store.delete(key);
    },
  };
})();

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const storage: SupportedStorage =
  Platform.OS === 'web'
    ? isBrowser
      ? AsyncStorage
      : memoryStorage
    : ExpoSecureStoreAdapter;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    // Disable session bits that are pointless during SSR pre-render.
    autoRefreshToken: isBrowser || Platform.OS !== 'web',
    persistSession: isBrowser || Platform.OS !== 'web',
    detectSessionInUrl: false,
  },
});
