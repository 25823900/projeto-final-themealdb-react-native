import { MealDetail, MealSummary } from '../types/meal';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

interface MealApiSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface MealApiDetail extends MealApiSummary {
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

interface MealApiResponse<T> {
  meals: T[] | null;
}

function toSummary(meal: MealApiSummary): MealSummary {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbUrl: meal.strMealThumb,
  };
}

async function getMeals<T>(url: string, errorMessage: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(errorMessage);

  const body = (await res.json()) as MealApiResponse<T>;
  return body.meals ?? [];
}

export async function fetchList(): Promise<MealSummary[]> {
  const meals = await getMeals<MealApiSummary>(
    `${BASE_URL}/search.php?s=`,
    'Falha ao carregar lista de receitas',
  );
  return meals.map(toSummary);
}

export async function fetchDetail(id: string): Promise<MealDetail> {
  const meals = await getMeals<MealApiDetail>(
    `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`,
    `Falha ao carregar detalhe da receita ${id}`,
  );
  const m = meals[0];
  if (!m) throw new Error('Receita não encontrada');

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const ingredient = m[`strIngredient${number}`]?.trim();
    const measure = m[`strMeasure${number}`]?.trim();
    return ingredient ? [measure, ingredient].filter(Boolean).join(' ') : null;
  }).filter((entry): entry is string => entry !== null);

  return {
    id: m.idMeal,
    name: m.strMeal,
    category: m.strCategory,
    area: m.strArea,
    thumbUrl: m.strMealThumb,
    instructions: m.strInstructions,
    ingredients,
  };
}

export async function fetchByCategory(category: string): Promise<MealSummary[]> {
  const meals = await getMeals<MealApiSummary>(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
    `Falha ao carregar categoria ${category}`,
  );
  return meals.map(toSummary);
}
