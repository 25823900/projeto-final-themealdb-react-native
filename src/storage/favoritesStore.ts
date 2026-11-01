import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFavoritesStore } from './favoritesStoreCore';

const KEY = 'favorite_meal_ids';

const favoritesStore = createFavoritesStore(AsyncStorage, KEY);

export const { loadFavorites, toggleFavorite } = favoritesStore;
