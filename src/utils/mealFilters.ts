import type { MealSummary } from '../types/meal';

export function filterMeals(meals: MealSummary[], searchText: string): MealSummary[] {
  const query = searchText.trim().toLocaleLowerCase();
  return meals.filter((meal) => meal.name.toLocaleLowerCase().includes(query));
}
