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
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
}

export type SearchForNutritionalContentProps = (
  foodName: string,
) => Promise<searchForNutritionalContentResponse>;
