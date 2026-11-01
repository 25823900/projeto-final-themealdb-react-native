import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { MealSummary } from '../types/meal';
import { theme } from '../theme';

export default function MealCard({
  meal,
  onPress,
  testID,
}: {
  meal: MealSummary;
  onPress: () => void;
  testID: string;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Ver receita ${meal.name}`}
      onPress={onPress}
      activeOpacity={0.88}
      style={{
        flex: 1,
        margin: 6,
        padding: 8,
        borderRadius: theme.radius.medium,
        backgroundColor: theme.colors.surface,
        shadowColor: '#28352D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {meal.thumbUrl ? (
        <Image
          source={{ uri: meal.thumbUrl }}
          resizeMode="cover"
          style={{
            width: '100%',
            aspectRatio: 1.08,
            borderRadius: theme.radius.small,
            backgroundColor: theme.colors.surfaceMuted,
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            aspectRatio: 1.08,
            borderRadius: theme.radius.small,
            backgroundColor: theme.colors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32 }}>🍲</Text>
        </View>
      )}
      <Text
        numberOfLines={2}
        style={{
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: '700',
          lineHeight: 19,
          marginHorizontal: 4,
          marginTop: 10,
          marginBottom: 8,
          minHeight: 38,
        }}
      >
        {meal.name}
      </Text>
    </TouchableOpacity>
  );
}
