import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchList, fetchNamesByCategory } from '../api/theMealDbApi';
import { MealSummary } from '../types/meal';
import type { RootStackParamList } from '../../App';
import BottomNav from './BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const CATEGORIES = ['Dessert', 'Beef', 'Seafood', 'Vegetarian'];

export default function ListScreen({ navigation }: Props) {
  const [all, setAll] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<Set<string> | null>(null);

  useEffect(() => {
    // TODO 1 (feature 1 — lista): chamar fetchList(), setAll() com o
    // resultado, setError() em caso de falha, setLoading(false) no final.
    setLoading(false);
  }, []);

  const onSelectCategory = async (category: string | null) => {
    // TODO 4 (feature 4 — categoria/filtro): quando `category` não é null,
    // chamar fetchNamesByCategory(category) e setCategoryNames() com o
    // resultado. Quando é null, limpar categoryNames.
    setSelectedCategory(category);
  };

  const filtered = useMemo(() => {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `all` por `categoryNames` (quando não-nulo, `categoryNames.has(p.name)`)
    // e por `searchText` (substring case-insensitive do `name`).
    return all;
  }, [all, categoryNames, searchText]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View testID="item-list-screen" collapsable={false} style={{ flex: 1 }}>
      <TextInput
        testID="search-input"
        placeholder="Buscar receita"
        value={searchText}
        onChangeText={setSearchText}
        style={{
          margin: 12,
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 48, paddingHorizontal: 12 }}
      >
        <Chip
          testID="category-chip-all"
          label="Todos"
          selected={selectedCategory === null}
          onPress={() => onSelectCategory(null)}
        />
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            testID={`category-chip-${category.toLowerCase()}`}
            label={category}
            selected={selectedCategory === category}
            onPress={() => onSelectCategory(category)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`item-card-${item.id}`}
            onPress={() => navigation.navigate('Detail', { mealId: item.id })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            {item.thumbUrl ? (
              <Image source={{ uri: item.thumbUrl }} style={{ width: 40, height: 40 }} />
            ) : null}
            <Text style={{ marginLeft: 12, fontSize: 16 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <BottomNav navigation={navigation} active="List" />
    </View>
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
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: selected ? '#e65100' : '#eee',
      }}
    >
      <Text style={{ color: selected ? '#fff' : '#333' }}>{label}</Text>
    </TouchableOpacity>
  );
}
