export interface NutrientInfo {
  value: number;
  unit: 'KCAL' | 'G';
}

export interface FoodItem {
  description: string;
  calories: NutrientInfo;
  protein: NutrientInfo;
  fat: NutrientInfo;
  carbs: NutrientInfo;
}

export interface searchForNutritionalContentResponse {
  food_weight: number;
  food_unit: string;
  search_query: string;
  search_results: FoodItem[];
}

export interface SearchForNutritionalContentProps {
  (food_query_string: string): Promise<searchForNutritionalContentResponse | null>;
}
