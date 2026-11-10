import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchFavoriteMeal } from '../services/mealsService';
import { loadFavorites } from '../storage/favoritesStore';
import { MealSummary } from '../types/meal';
import type { RootStackParamList } from '../../App';
import MealCard from '../components/MealCard';
import BottomNav from './BottomNav';
import { useAppTheme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const [favorites, setFavorites] = useState<MealSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setFavorites(null);
      setError(null);

      const load = async () => {
        try {
          const ids = await loadFavorites();
          const meals = await Promise.all(Array.from(ids, (id) => fetchFavoriteMeal(id)));
          if (active) {
            setFavorites(meals);
          }
        } catch (loadError) {
          if (active) {
            setError(
              loadError instanceof Error ? loadError.message : 'Erro ao carregar favoritos.',
            );
          }
        }
      };

      void load();
      return () => {
        active = false;
      };
    }, [reload]),
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {error && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <Text style={{ fontSize: 44 }}>💛</Text>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800', marginTop: 16 }}>
            Seus favoritos não carregaram
          </Text>
          <Text accessibilityRole="alert" style={{ color: theme.colors.textMuted, marginTop: 8, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setReload((attempt) => attempt + 1)}
            style={{
              marginTop: 18,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: theme.radius.pill,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: theme.colors.white, fontWeight: '700' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      {favorites === null && !error && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <Text style={{ marginTop: 14, color: theme.colors.textMuted }}>Carregando seus favoritos...</Text>
        </View>
      )}
      {favorites !== null && favorites.length === 0 && !error && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.accentSoft,
            }}
          >
            <Text style={{ fontSize: 42 }}>♡</Text>
          </View>
          <Text style={{ color: theme.colors.text, fontSize: 21, fontWeight: '800', marginTop: 22 }}>
            Sua coleção começa aqui
          </Text>
          <Text style={{ color: theme.colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' }}>
            Toque no coração de uma receita para guardá-la e encontrá-la aqui depois.
          </Text>
        </View>
      )}
      {favorites !== null && favorites.length > 0 && !error && (
        <FlatList
          style={{ flex: 1 }}
          data={favorites}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 10, flexGrow: 1 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 6, paddingTop: 22, paddingBottom: 16 }}>
              <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 }}>
                SUA COLEÇÃO PESSOAL
              </Text>
              <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 }}>
                Favoritos
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 14, marginTop: 5 }}>
                {favorites.length} {favorites.length === 1 ? 'receita guardada' : 'receitas guardadas'} para fazer depois.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              testID={`favorite-item-${item.id}`}
              onPress={() => navigation.navigate('Detail', { mealId: item.id })}
            />
          )}
        />
      )}
      <BottomNav navigation={navigation} active="Favorites" />
    </SafeAreaView>
  );
}
