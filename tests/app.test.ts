import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { fetchByCategory, fetchDetail, fetchList } from '../src/api/theMealDbApi';
import { createFavoritesStore } from '../src/storage/favoritesStoreCore';
import { filterMeals } from '../src/utils/mealFilters';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

test('filterMeals matches recipe names case-insensitively and trims the query', () => {
  const meals = [
    { id: '1', name: 'Chicken Curry', thumbUrl: 'chicken.jpg' },
    { id: '2', name: 'Apple Pie', thumbUrl: 'pie.jpg' },
  ];

  assert.deepEqual(filterMeals(meals, '  cHicKen '), [meals[0]]);
  assert.deepEqual(filterMeals(meals, ''), meals);
  assert.deepEqual(filterMeals(meals, 'soup'), []);
});

test('fetchList maps TheMealDB records to summaries', async () => {
  globalThis.fetch = async (input) => {
    assert.equal(String(input), 'https://www.themealdb.com/api/json/v1/1/search.php?s=');
    return mockResponse({
      meals: [{ idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole', strMealThumb: 'meal.jpg' }],
    });
  };

  assert.deepEqual(await fetchList(), [
    { id: '52772', name: 'Teriyaki Chicken Casserole', thumbUrl: 'meal.jpg' },
  ]);
});

test('fetchByCategory encodes the category and returns an empty list for no matches', async () => {
  globalThis.fetch = async (input) => {
    assert.equal(String(input), 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood%20%26%20Fish');
    return mockResponse({ meals: null });
  };

  assert.deepEqual(await fetchByCategory('Seafood & Fish'), []);
});

test('fetchDetail maps instructions and non-empty ingredients', async () => {
  globalThis.fetch = async () =>
    mockResponse({
      meals: [
        {
          idMeal: '52772',
          strMeal: 'Chicken',
          strMealThumb: 'meal.jpg',
          strCategory: 'Chicken',
          strArea: 'Japanese',
          strInstructions: 'Cook the chicken.',
          strIngredient1: 'Chicken',
          strMeasure1: '1 lb',
          strIngredient2: '  ',
          strMeasure2: '1 tsp',
        },
      ],
    });

  assert.deepEqual(await fetchDetail('52772'), {
    id: '52772',
    name: 'Chicken',
    category: 'Chicken',
    area: 'Japanese',
    thumbUrl: 'meal.jpg',
    instructions: 'Cook the chicken.',
    ingredients: ['1 lb Chicken'],
  });
});

test('favorites persist across store instances and toggle on and off', async () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const firstStore = createFavoritesStore(storage, 'favorite_meal_ids');

  assert.deepEqual(await firstStore.loadFavorites(), new Set());
  assert.deepEqual(await firstStore.toggleFavorite('52772'), new Set(['52772']));

  const reopenedStore = createFavoritesStore(storage, 'favorite_meal_ids');
  assert.deepEqual(await reopenedStore.loadFavorites(), new Set(['52772']));
  assert.deepEqual(await reopenedStore.toggleFavorite('52772'), new Set());
  assert.deepEqual(await firstStore.loadFavorites(), new Set());
});

test('API failures reject with a readable error', async () => {
  globalThis.fetch = async () => mockResponse({}, false);
  await assert.rejects(fetchList(), /Falha ao carregar lista de receitas/);
});
