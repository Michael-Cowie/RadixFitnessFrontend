import { get } from 'services/DataService';

import {
  SearchForNutritionalContentProps,
  searchForNutritionalContentResponse,
} from './foodDataCentralInterface';

const FOODDATA_CENTRAL_END_POINT = '/api/v1/foods/';
const SEARCH_END_POINT = FOODDATA_CENTRAL_END_POINT + 'search/';

export const searchForNutritionalContent: SearchForNutritionalContentProps = async (
  foodName,
): Promise<searchForNutritionalContentResponse> => {
  const response = await get(SEARCH_END_POINT, { food: foodName });

  if (response.status === 200) {
    const { carbs, fat, protein } = response.data.food_nutrient;
    return {
      carbsPer100g: carbs.value,
      fatPer100g: fat.value,
      proteinPer100g: protein.value,
    };
  }

  throw new Error('Unexpected response status');
};
