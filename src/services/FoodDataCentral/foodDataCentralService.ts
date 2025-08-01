import { get } from 'services/DataService';
import { FoodItem, FoodNutrientSummary } from './foodDataCentralInterface';

const FOODDATA_CENTRAL_END_POINT = '/api/v1/foods/';
const SEARCH_END_POINT = FOODDATA_CENTRAL_END_POINT + 'search/';

const CACHE_PREFIX = 'foodCache/';

function getCacheKey(foodName: string) {
  return `${CACHE_PREFIX}${foodName.toLowerCase().trim()}`;
}

function getCachedResult(foodName: string): FoodNutrientSummary[] | null {
  const raw = localStorage.getItem(getCacheKey(foodName));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FoodNutrientSummary[];
  } catch {
    localStorage.removeItem(getCacheKey(foodName));
    return null;
  }
}

function cacheResult(foodName: string, data: FoodNutrientSummary[]) {
  localStorage.setItem(getCacheKey(foodName), JSON.stringify(data));
}

/**
 * Searches for nutritional content of a given food name, with permanent localStorage caching.
 *
 * @param {string} foodName - The name of the food to search for.
 * @returns {Promise<FoodNutrientSummary[]>} - A list of foods that match the queried string with macronutrients included.
 * @throws {Error} - If the response status is not 200.
 */
export const searchForNutritionalContent = async (
  foodName: string,
): Promise<FoodNutrientSummary[]> => {
  const cached = getCachedResult(foodName);
  if (cached) return cached;

  const response = await get(SEARCH_END_POINT, { food: foodName });

  if (response.status === 200) {
    const result: FoodNutrientSummary[] = response.data.search_results.map((item: FoodItem) => ({
      description: item.description,
      carbsPer100g: item.carbs.value,
      fatPer100g: item.fat.value,
      proteinPer100g: item.protein.value,
    }));

    cacheResult(foodName, result);
    return result;
  }

  throw new Error('Unexpected response status');
};
