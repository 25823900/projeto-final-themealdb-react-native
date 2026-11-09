import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchByCategory, fetchList } from '../api/theMealDbApi';
import { loadFavorites, toggleFavorite } from '../storage/favoritesStore';
import { MealSummary } from '../types/meal';
import { filterMeals } from '../utils/mealFilters';
import type { RootStackParamList } from '../../App';
import MealCard from '../components/MealCard';
import BottomNav from './BottomNav';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const CATEGORIES = [
  { apiName: 'Dessert', label: 'Sobremesas' },
  { apiName: 'Beef', label: 'Carnes' },
  { apiName: 'Seafood', label: 'Frutos do mar' },
  { apiName: 'Vegetarian', label: 'Vegetarianas' },
];

export default function ListScreen({ navigation }: Props) {
  const [all, setAll] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryMeals, setCategoryMeals] = useState<MealSummary[] | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryRequest, setCategoryRequest] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadFavorites()
        .then((ids) => {
          if (active) {
            setFavorites(ids);
            setFavoriteError(null);
          }
        })
        .catch((loadError: unknown) => {
          if (active) {
            setFavoriteError(
              loadError instanceof Error ? loadError.message : 'Erro ao carregar favoritos.',
            );
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const loadList = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      setAll(await fetchList());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar receitas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const onSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setCategoryError(null);
    setCategoryMeals(null);
  };

  const onToggleFavorite = async (id: string) => {
    setSavingFavorite(true);
    setFavoriteError(null);
    try {
      setFavorites(await toggleFavorite(id));
    } catch (saveError) {
      setFavoriteError(
        saveError instanceof Error ? saveError.message : 'Erro ao salvar favorito.',
      );
    } finally {
      setSavingFavorite(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === null) {
      setCategoryLoading(false);
      return undefined;
    }

    let active = true;
    setCategoryLoading(true);
    setCategoryError(null);
    fetchByCategory(selectedCategory)
      .then((meals) => {
        if (active) setCategoryMeals(meals);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setCategoryError(
            loadError instanceof Error ? loadError.message : 'Erro ao carregar a categoria.',
          );
        }
      })
      .finally(() => {
        if (active) setCategoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCategory, categoryRequest]);

  const filtered = useMemo(() => {
    const source = selectedCategory === null ? all : categoryMeals ?? [];
    return filterMeals(source, searchText);
  }, [all, categoryMeals, searchText, selectedCategory]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: theme.radius.large,
              backgroundColor: theme.colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
          <Text style={{ marginTop: 18, color: theme.colors.text, fontSize: 17, fontWeight: '700' }}>
            Preparando algo gostoso...
          </Text>
          <Text style={{ marginTop: 6, color: theme.colors.textMuted }}>Carregando receitas</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 48 }}>🍲</Text>
          <Text style={{ marginTop: 16, color: theme.colors.text, fontSize: 21, fontWeight: '800' }}>
            Não foi possível carregar
          </Text>
          <Text style={{ marginTop: 8, color: theme.colors.textMuted, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => void loadList()}
            style={{
              marginTop: 20,
              paddingHorizontal: 22,
              paddingVertical: 13,
              borderRadius: theme.radius.pill,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: theme.colors.white, fontWeight: '700' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      testID="item-list-screen"
      collapsable={false}
      edges={['top']}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          void loadList(false);
        }}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 10, flexGrow: 1 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListHeaderComponent={
          <View>
            <View style={{ paddingHorizontal: 6, paddingTop: 18 }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: theme.radius.pill,
                  backgroundColor: theme.colors.primarySoft,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primaryDark,
                    fontSize: 11,
                    fontWeight: '800',
                    letterSpacing: 1.1,
                  }}
                >
                  RECEITAS PARA HOJE
                </Text>
              </View>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 28,
                  fontWeight: '800',
                  letterSpacing: -0.8,
                  lineHeight: 36,
                  marginTop: 12,
                }}
              >
                Bora cozinhar
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 14, marginTop: 5 }}>
                Encontre algo delicioso.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 6,
                marginTop: 16,
                marginBottom: 14,
                paddingHorizontal: 15,
                borderRadius: theme.radius.medium,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                shadowColor: '#28352D',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 1,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 21, marginRight: 10 }}>⌕</Text>
              <TextInput
                testID="search-input"
                accessibilityLabel="Buscar receita"
                placeholder="Buscar uma receita..."
                placeholderTextColor={theme.colors.textMuted}
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                style={{
                  flex: 1,
                  minHeight: 50,
                  color: theme.colors.text,
                  fontSize: 14,
                }}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Limpar busca"
                  onPress={() => setSearchText('')}
                  style={{ padding: 8 }}
                >
                  <Text style={{ color: theme.colors.textMuted, fontSize: 16 }}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: '800',
                marginHorizontal: 6,
                marginBottom: 8,
              }}
            >
              Categorias
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 14 }}
            >
              <Chip
                testID="category-chip-all"
                label="Todas"
                selected={selectedCategory === null}
                onPress={() => onSelectCategory(null)}
              />
              {CATEGORIES.map(({ apiName, label }) => (
                <Chip
                  key={apiName}
                  testID={`category-chip-${apiName.toLowerCase()}`}
                  label={label}
                  selected={selectedCategory === apiName}
                  onPress={() => onSelectCategory(apiName)}
                />
              ))}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 6,
                marginBottom: 8,
              }}
            >
              <View>
                <Text style={{ color: theme.colors.text, fontSize: 19, fontWeight: '800' }}>
                  {selectedCategory ? CATEGORIES.find((item) => item.apiName === selectedCategory)?.label : 'Para experimentar'}
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 3 }}>
                  {filtered.length} {filtered.length === 1 ? 'receita' : 'receitas'}
                </Text>
              </View>
              <Text style={{ fontSize: 22 }}>🥗</Text>
            </View>
            {categoryLoading && (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 8 }}>
                <ActivityIndicator color={theme.colors.primary} size="small" />
                <Text style={{ color: theme.colors.textMuted, fontSize: 13, marginLeft: 8 }}>
                  Carregando categoria...
                </Text>
              </View>
            )}
            {categoryError && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  marginHorizontal: 6,
                  marginBottom: 10,
                  borderRadius: theme.radius.small,
                  backgroundColor: theme.colors.accentSoft,
                }}
              >
                <Text style={{ color: theme.colors.danger, flex: 1, fontSize: 12 }}>{categoryError}</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => setCategoryRequest((request) => request + 1)}
                  style={{ padding: 6 }}
                >
                  <Text style={{ color: theme.colors.primaryDark, fontWeight: '700' }}>Tentar</Text>
                </TouchableOpacity>
              </View>
            )}
            {favoriteError && (
              <Text
                accessibilityRole="alert"
                style={{ color: theme.colors.danger, fontSize: 12, marginHorizontal: 6, marginBottom: 10 }}
              >
                {favoriteError}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          categoryLoading || categoryError ? undefined : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 30,
                margin: 6,
                borderRadius: theme.radius.medium,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Text style={{ fontSize: 38 }}>{searchText.trim() ? '🔎' : '🍽️'}</Text>
              <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700', marginTop: 12 }}>
                {searchText.trim() ? 'Nenhuma receita encontrada' : 'Nenhuma receita disponível'}
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 13, marginTop: 5, textAlign: 'center' }}>
                Tente mudar a busca ou escolher outra categoria.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            testID={`item-card-${item.id}`}
            onPress={() => navigation.navigate('Detail', { mealId: item.id })}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={() => void onToggleFavorite(item.id)}
            favoriteDisabled={savingFavorite}
          />
        )}
      />
      <BottomNav navigation={navigation} active="List" />
    </SafeAreaView>
  );
}

function Chip({
  testID,
  label,
  selected,
  onPress,
}: {
  testID: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.pill,
        marginRight: 8,
        backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
        borderWidth: 1,
        borderColor: selected ? theme.colors.primary : theme.colors.border,
      }}
    >
      <Text style={{ color: selected ? theme.colors.white : theme.colors.textMuted, fontSize: 12, fontWeight: '700' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
