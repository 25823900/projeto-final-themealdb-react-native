import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { theme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingHorizontal: 20,
      }}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'List' }}
        onPress={() => navigation.navigate('List')}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
          borderRadius: theme.radius.pill,
          backgroundColor: active === 'List' ? theme.colors.primarySoft : 'transparent',
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 2 }}>🍽️</Text>
        <Text
          style={{
            color: active === 'List' ? theme.colors.primaryDark : theme.colors.textMuted,
            fontSize: 12,
            fontWeight: active === 'List' ? '700' : '500',
          }}
        >
          Receitas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="tab-favorites"
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'Favorites' }}
        onPress={() => navigation.navigate('Favorites')}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
          borderRadius: theme.radius.pill,
          backgroundColor: active === 'Favorites' ? theme.colors.primarySoft : 'transparent',
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 2 }}>♥</Text>
        <Text
          style={{
            color: active === 'Favorites' ? theme.colors.primaryDark : theme.colors.textMuted,
            fontSize: 12,
            fontWeight: active === 'Favorites' ? '700' : '500',
          }}
        >
          Favoritos
        </Text>
      </TouchableOpacity>
    </View>
  );
}
