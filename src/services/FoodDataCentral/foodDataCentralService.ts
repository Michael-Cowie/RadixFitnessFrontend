import { get } from 'services/DataService';

import { FoodItem, FoodNutrientSummary } from './foodDataCentralInterface';

const FOODDATA_CENTRAL_END_POINT = '/api/v1/foods/';
const SEARCH_END_POINT = FOODDATA_CENTRAL_END_POINT + 'search/';

/**
 * Searches for nutritional content of a given food name.
 *
 * @param {string} foodName - The name of the food to search for.
 * @returns {Promise<FoodNutrientSummary[]>} - A list of foods that match the queried string with macronutrients included.
 * @throws {Error} - If the response status is not 200.
 */
export const searchForNutritionalContent = async (
  foodName: string,
): Promise<FoodNutrientSummary[]> => {
  const response = await get(SEARCH_END_POINT, { food: foodName });

  if (response.status === 200) {
    return response.data.search_results.map((item: FoodItem) => ({
      description: item.description,
      carbsPer100g: item.carbs.value,
      fatPer100g: item.fat.value,
      proteinPer100g: item.protein.value,
    }));
  }

  throw new Error('Unexpected response status');
};
