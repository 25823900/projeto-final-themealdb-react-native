import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDetail } from '../api/theMealDbApi';
import { loadFavorites, toggleFavorite } from '../storage/favoritesStore';
import { MealDetail } from '../types/meal';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { mealId } = route.params;
  const [detail, setDetail] = useState<MealDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO 2 (feature 2 — detalhe): chamar fetchDetail(mealId) e
    // setDetail() com o resultado (setError() em caso de falha). Também
    // chamar loadFavorites() e setIsFavorite(favs.has(mealId)).
  }, [mealId]);

  const onToggleFavorite = async () => {
    // TODO 5 (feature 5 — favoritos): chamar toggleFavorite(mealId) e
    // setIsFavorite(favs.has(mealId)) com o resultado.
  };

  return (
    <View testID="detail-screen" collapsable={false} style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity
        testID="detail-back-button"
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 12 }}
      >
        <Text style={{ fontSize: 16 }}>{'< Voltar'}</Text>
      </TouchableOpacity>
      {error && <Text>{error}</Text>}
      {!detail && !error && <ActivityIndicator />}
      {detail && (
        <>
          {detail.thumbUrl ? (
            <Image
              source={{ uri: detail.thumbUrl }}
              style={{ width: 140, height: 140, alignSelf: 'center' }}
            />
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <Text testID="detail-title" style={{ fontSize: 24, fontWeight: 'bold' }}>
              {detail.name}
            </Text>
            <TouchableOpacity testID="detail-favorite-button" onPress={onToggleFavorite}>
              <Text style={{ fontSize: 24 }}>{isFavorite ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 16 }}>Categoria: {detail.category}</Text>
          <Text>Área: {detail.area}</Text>
        </>
      )}
    </View>
  );
}
