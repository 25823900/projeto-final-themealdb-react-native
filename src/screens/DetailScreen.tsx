import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDetail } from '../services/mealsService';
import { loadFavorites, toggleFavorite } from '../storage/favoritesStore';
import { MealDetail } from '../types/meal';
import type { RootStackParamList } from '../../App';
import { useAppTheme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const { mealId } = route.params;
  const [detail, setDetail] = useState<MealDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setDetail(null);
    setError(null);
    setFavoriteError(null);

    fetchDetail(mealId)
      .then((meal) => {
        if (active) setDetail(meal);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar a receita.');
        }
      });

    loadFavorites()
      .then((favorites) => {
        if (active) setIsFavorite(favorites.has(mealId));
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
  }, [mealId, reload]);

  const onToggleFavorite = async () => {
    setSavingFavorite(true);
    setFavoriteError(null);
    try {
      const favorites = await toggleFavorite(mealId);
      setIsFavorite(favorites.has(mealId));
    } catch (saveError) {
      setFavoriteError(
        saveError instanceof Error ? saveError.message : 'Erro ao salvar favorito.',
      );
    } finally {
      setSavingFavorite(false);
    }
  };

  return (
    <SafeAreaView
      testID="detail-screen"
      collapsable={false}
      edges={['top']}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {detail ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
          <View>
            {detail.thumbUrl ? (
              <Image
                source={{ uri: detail.thumbUrl }}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: 320,
                  backgroundColor: theme.colors.surfaceMuted,
                  borderBottomLeftRadius: theme.radius.large,
                  borderBottomRightRadius: theme.radius.large,
                }}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: 260,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.surfaceMuted,
                  borderBottomLeftRadius: theme.radius.large,
                  borderBottomRightRadius: theme.radius.large,
                }}
              >
                <Text style={{ fontSize: 64 }}>🍲</Text>
              </View>
            )}
            <TouchableOpacity
              testID="detail-back-button"
              accessibilityRole="button"
              accessibilityLabel="Voltar para receitas"
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: 14,
                left: 18,
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius.pill,
                backgroundColor: theme.colors.surface,
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 23 }}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="detail-favorite-button"
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              accessibilityState={{ selected: isFavorite, disabled: savingFavorite }}
              onPress={() => void onToggleFavorite()}
              disabled={savingFavorite}
              style={{
                position: 'absolute',
                right: 20,
                bottom: -25,
                width: 52,
                height: 52,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius.pill,
                backgroundColor: theme.colors.surface,
                shadowColor: '#28352D',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ color: isFavorite ? theme.colors.accent : theme.colors.textMuted, fontSize: 25 }}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: theme.spacing.page }}>
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: 25,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: theme.radius.pill,
                backgroundColor: theme.colors.primarySoft,
              }}
            >
              <Text style={{ color: theme.colors.primaryDark, fontSize: 11, fontWeight: '800' }}>
                {detail.category.toLocaleUpperCase()}
              </Text>
            </View>
            <Text
              testID="detail-title"
              style={{
                color: theme.colors.text,
                fontSize: 30,
                fontWeight: '800',
                letterSpacing: -0.5,
                lineHeight: 36,
                marginTop: 12,
                paddingRight: 42,
              }}
            >
              {detail.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: theme.colors.accent, fontSize: 16 }}>✦</Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 13, marginLeft: 7 }}>
                Receita de {detail.area}
              </Text>
            </View>
            {favoriteError && (
              <Text accessibilityRole="alert" style={{ color: theme.colors.danger, marginTop: 10 }}>
                {favoriteError}
              </Text>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 24,
                marginBottom: 14,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: theme.radius.small,
                  backgroundColor: theme.colors.accentSoft,
                }}
              >
                <Text style={{ fontSize: 18 }}>🥕</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: theme.colors.text, fontSize: 19, fontWeight: '800' }}>
                  Ingredientes
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  {detail.ingredients.length} itens para separar
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderRadius: theme.radius.medium,
                backgroundColor: theme.colors.surface,
              }}
            >
              {detail.ingredients.map((ingredient, index) => (
                <View
                  key={`${index}-${ingredient}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: index === detail.ingredients.length - 1 ? 0 : 1,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: theme.radius.pill,
                      backgroundColor: theme.colors.accent,
                      marginRight: 12,
                    }}
                  />
                  <Text style={{ color: theme.colors.text, flex: 1, fontSize: 14, lineHeight: 20 }}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 14 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: theme.radius.small,
                  backgroundColor: theme.colors.primarySoft,
                }}
              >
                <Text style={{ fontSize: 18 }}>👩‍🍳</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: theme.colors.text, fontSize: 19, fontWeight: '800' }}>
                  Modo de preparo
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  Mãos à obra!
                </Text>
              </View>
            </View>
            <View
              style={{
                padding: 17,
                borderRadius: theme.radius.medium,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 14, lineHeight: 23 }}>
                {detail.instructions}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          {error ? (
            <>
              <Text style={{ fontSize: 46 }}>🍲</Text>
              <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800', marginTop: 14 }}>
                Não foi possível abrir a receita
              </Text>
              <Text style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 8 }}>
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
            </>
          ) : (
            <>
              <ActivityIndicator color={theme.colors.primary} size="large" />
              <Text style={{ color: theme.colors.textMuted, marginTop: 14 }}>Carregando receita...</Text>
            </>
          )}
          <TouchableOpacity
            testID="detail-back-button"
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={{ padding: 12, marginTop: 12 }}
          >
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>‹ Voltar às receitas</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
