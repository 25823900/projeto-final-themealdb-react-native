import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  NETWORK_ERROR_MESSAGE,
  fetchByCategory,
  fetchDetail,
  fetchList,
} from '../src/api/theMealDbApi';
import { createFavoritesStore } from '../src/storage/favoritesStoreCore';
import { createThemeStore } from '../src/storage/themeStoreCore';
import { createMealsService } from '../src/services/mealsServiceCore';
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

test('network failures reject with a friendly offline message', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('Network request failed');
  };
  await assert.rejects(fetchList(), { message: NETWORK_ERROR_MESSAGE });
});

test('meals service caches list, detail, and category responses for offline use', async () => {
  const values = new Map<string, string>();
  const cache = {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const list = [{ id: '1', name: 'Soup', thumbUrl: 'soup.jpg' }];
  const detail = {
    ...list[0],
    category: 'Starter',
    area: 'British',
    instructions: 'Cook.',
    ingredients: ['Water'],
  };
  const onlineService = createMealsService(
    {
      fetchList: async () => list,
      fetchDetail: async () => detail,
      fetchByCategory: async () => list,
    },
    cache,
  );
  await onlineService.fetchList();
  await onlineService.fetchDetail('1');
  await onlineService.fetchByCategory('Starter');

  const offlineService = createMealsService(
    {
      fetchList: async () => {
        throw new Error('offline');
      },
      fetchDetail: async () => {
        throw new Error('offline');
      },
      fetchByCategory: async () => {
        throw new Error('offline');
      },
    },
    cache,
  );
  assert.deepEqual(await offlineService.fetchList(), list);
  assert.deepEqual(await offlineService.fetchDetail('1'), detail);
  assert.deepEqual(await offlineService.fetchByCategory('Starter'), list);
});

test('meals service preserves the API error when no offline copy exists', async () => {
  const service = createMealsService(
    {
      fetchList: async () => {
        throw new Error('API unavailable');
      },
      fetchDetail: async () => {
        throw new Error('API unavailable');
      },
      fetchByCategory: async () => {
        throw new Error('API unavailable');
      },
    },
    { getItem: async () => null, setItem: async () => undefined },
  );
  await assert.rejects(service.fetchList(), { message: 'API unavailable' });
});

test('favorite summaries remain available offline even when their details were never opened', async () => {
  const values = new Map<string, string>();
  const cache = {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const meal = { id: '1', name: 'Soup', thumbUrl: 'soup.jpg' };
  const service = createMealsService(
    {
      fetchList: async () => [meal],
      fetchDetail: async () => {
        throw new Error('offline');
      },
      fetchByCategory: async () => [],
    },
    cache,
  );
  await service.fetchList();
  assert.deepEqual(await service.fetchFavoriteMeal('1'), meal);
});

test('meals service reports a corrupted offline copy', async () => {
  const service = createMealsService(
    {
      fetchList: async () => {
        throw new Error('offline');
      },
      fetchDetail: async () => {
        throw new Error('offline');
      },
      fetchByCategory: async () => {
        throw new Error('offline');
      },
    },
    { getItem: async () => '{invalid', setItem: async () => undefined },
  );
  await assert.rejects(service.fetchList(), /cache local de receitas está inválido/);
});

test('theme preference defaults to light and persists the selected mode', async () => {
  const values = new Map<string, string>();
  const store = createThemeStore(
    {
      getItem: async (key) => values.get(key) ?? null,
      setItem: async (key, value) => {
        values.set(key, value);
      },
    },
    'theme',
  );

  assert.equal(await store.load(), 'light');
  await store.save('dark');
  assert.equal(await store.load(), 'dark');
});

test('theme preference rejects unknown stored values', async () => {
  const store = createThemeStore(
    { getItem: async () => 'system', setItem: async () => undefined },
    'theme',
  );
  await assert.rejects(store.load(), /Preferência de tema inválida/);
});
