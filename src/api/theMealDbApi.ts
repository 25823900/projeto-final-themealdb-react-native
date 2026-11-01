import { MealDetail, MealSummary } from '../types/meal';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchList(): Promise<MealSummary[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=`);
  if (!res.ok) throw new Error('Falha ao carregar lista de receitas');
  const body = await res.json();
  const meals = body.meals ?? [];
  return meals.map((entry: { idMeal: string; strMeal: string; strMealThumb: string }) => ({
    id: entry.idMeal,
    name: entry.strMeal,
    thumbUrl: entry.strMealThumb,
  }));
}

export async function fetchDetail(id: string): Promise<MealDetail> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  if (!res.ok) throw new Error(`Falha ao carregar detalhe da receita ${id}`);
  const body = await res.json();
  const m = body.meals[0];
  return {
    id: m.idMeal,
    name: m.strMeal,
    category: m.strCategory,
    area: m.strArea,
    thumbUrl: m.strMealThumb,
  };
}

// A própria API filtra por categoria — sem precisar de endpoint separado de
// "tipo" como o PokeAPI.
export async function fetchNamesByCategory(category: string): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  if (!res.ok) throw new Error(`Falha ao carregar categoria ${category}`);
  const body = await res.json();
  const meals = body.meals ?? [];
  return new Set(meals.map((entry: { strMeal: string }) => entry.strMeal));
}
