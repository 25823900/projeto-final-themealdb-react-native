import type { MealDetail, MealSummary } from '../types/meal';

export interface MealsApi {
  fetchList(): Promise<MealSummary[]>;
  fetchDetail(id: string): Promise<MealDetail>;
  fetchByCategory(category: string): Promise<MealSummary[]>;
}

export interface MealsCache {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export function createMealsService(api: MealsApi, cache: MealsCache, prefix = 'meals_cache') {
  const summaryKey = (id: string) => `${prefix}:summary:${encodeURIComponent(id)}`;

  async function cachedRequest<T>(key: string, request: () => Promise<T>): Promise<T> {
    let result: T;
    try {
      result = await request();
    } catch (requestError) {
      const cached = await cache.getItem(`${prefix}:${key}`);
      if (cached === null) throw requestError;

      try {
        return JSON.parse(cached) as T;
      } catch {
        throw new Error('O cache local de receitas está inválido. Limpe os dados do app e tente novamente.');
      }
    }
    await cache.setItem(`${prefix}:${key}`, JSON.stringify(result));
    return result;
  }

  async function cacheSummaries(meals: MealSummary[]): Promise<MealSummary[]> {
    await Promise.all(
      meals.map((meal) => cache.setItem(summaryKey(meal.id), JSON.stringify(meal))),
    );
    return meals;
  }

  async function fetchFavoriteMeal(id: string): Promise<MealSummary> {
    let detail: MealDetail;
    try {
      detail = await api.fetchDetail(id);
    } catch (requestError) {
      const cachedDetail = await cache.getItem(`${prefix}:detail:${encodeURIComponent(id)}`);
      if (cachedDetail !== null) {
        try {
          detail = JSON.parse(cachedDetail) as MealDetail;
        } catch {
          throw new Error(
            'O cache local de receitas está inválido. Limpe os dados do app e tente novamente.',
          );
        }
        return { id: detail.id, name: detail.name, thumbUrl: detail.thumbUrl };
      }

      const cached = await cache.getItem(summaryKey(id));
      if (cached === null) throw requestError;

      try {
        const meal: unknown = JSON.parse(cached);
        if (
          typeof meal !== 'object' ||
          meal === null ||
          !('id' in meal) ||
          !('name' in meal) ||
          !('thumbUrl' in meal) ||
          typeof meal.id !== 'string' ||
          typeof meal.name !== 'string' ||
          typeof meal.thumbUrl !== 'string'
        ) {
          throw new Error('invalid summary');
        }
        return { id: meal.id, name: meal.name, thumbUrl: meal.thumbUrl };
      } catch {
        throw new Error(
          'O cache local de receitas está inválido. Limpe os dados do app e tente novamente.',
        );
      }
    }
    await cache.setItem(
      `${prefix}:detail:${encodeURIComponent(id)}`,
      JSON.stringify(detail),
    );
    return { id: detail.id, name: detail.name, thumbUrl: detail.thumbUrl };
  }

  return {
    fetchList: async () => cacheSummaries(await cachedRequest('list', () => api.fetchList())),
    fetchDetail: (id: string) =>
      cachedRequest(`detail:${encodeURIComponent(id)}`, () => api.fetchDetail(id)),
    fetchFavoriteMeal,
    fetchByCategory: async (category: string) =>
      cacheSummaries(
        await cachedRequest(`category:${encodeURIComponent(category)}`, () =>
          api.fetchByCategory(category),
        ),
      ),
  };
}
