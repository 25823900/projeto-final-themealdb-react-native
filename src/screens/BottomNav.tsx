import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Nav = Pick<
  NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
  'navigate'
>;

export default function BottomNav({
  navigation,
  active,
}: {
  navigation: Nav;
  active: 'List' | 'Favorites';
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('List')}
        style={{ flex: 1, alignItems: 'center' }}
      >
        <Text style={{ color: active === 'List' ? '#c62828' : '#888' }}>Receitas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="tab-favorites"
        onPress={() => navigation.navigate('Favorites')}
        style={{ flex: 1, alignItems: 'center' }}
      >
        <Text style={{ color: active === 'Favorites' ? '#c62828' : '#888' }}>Favoritos</Text>
      </TouchableOpacity>
    </View>
  );
}
