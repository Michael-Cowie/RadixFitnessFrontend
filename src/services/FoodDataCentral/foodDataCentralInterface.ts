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

export type FoodNutrientSummary = {
  description: string;
  carbsPer100g: number;
  fatPer100g: number;
  proteinPer100g: number;
};
