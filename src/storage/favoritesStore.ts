import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorite_meal_ids';

export async function loadFavorites(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw) as string[]);
}

export async function toggleFavorite(id: string): Promise<Set<string>> {
  const current = await loadFavorites();
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(current)));
  return current;
}
