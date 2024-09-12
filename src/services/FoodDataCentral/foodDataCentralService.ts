import { get } from 'services/DataService';

import {
    SearchForNutritionalContentProps, searchForNutritionalContentResponse
} from './foodDataCentralInterface';

const FOODDATA_CENTRAL_END_POINT = '/api/v1/fooddata-central/';
const SEARCH_END_POINT = FOODDATA_CENTRAL_END_POINT + "search/";
  

export const searchForNutritionalContent: SearchForNutritionalContentProps = async (food_query_string) => {
  try {
    const response = await get(SEARCH_END_POINT, { params: { food: food_query_string } });

    if (response.status === 200) {
      return response.data as searchForNutritionalContentResponse;
    }
    return null;
  } catch (error) {
    return null;
  }
};
