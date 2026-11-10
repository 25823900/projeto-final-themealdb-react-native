import type { KeyValueStorage } from './favoritesStoreCore';

export type ThemeMode = 'light' | 'dark';

export function createThemeStore(storage: KeyValueStorage, key: string) {
  return {
    async load(): Promise<ThemeMode> {
      const value = await storage.getItem(key);
      if (value === null) return 'light';
      if (value !== 'light' && value !== 'dark') {
        throw new Error('Preferência de tema inválida.');
      }
      return value;
    },
    async save(mode: ThemeMode): Promise<void> {
      await storage.setItem(key, mode);
    },
  };
}
