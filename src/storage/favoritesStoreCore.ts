export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export function createFavoritesStore(storage: KeyValueStorage, key: string) {
  async function loadFavorites(): Promise<Set<string>> {
    const raw = await storage.getItem(key);
    if (raw === null) return new Set();

    const ids: unknown = JSON.parse(raw);
    if (!Array.isArray(ids) || !ids.every((id): id is string => typeof id === 'string')) {
      throw new Error('Dados de favoritos inválidos.');
    }

    return new Set(ids);
  }

  async function toggleFavorite(id: string): Promise<Set<string>> {
    const favorites = await loadFavorites();
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }
    await storage.setItem(key, JSON.stringify(Array.from(favorites)));
    return favorites;
  }

  return { loadFavorites, toggleFavorite };
}
