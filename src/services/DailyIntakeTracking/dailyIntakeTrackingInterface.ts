import { Dayjs } from 'dayjs';

export interface MacroNutrientProgress {
    current_calories: number;
    current_carbs: number;
    current_fats: number;
    current_protein: number;
    date: string;
    goal_calories: number;
    goal_carbs: number;
    goal_fats: number;
    goal_protein: number;
}
  
export interface GetMacroNutrientProgressOnDateProps {
    (date: Dayjs): Promise<MacroNutrientProgress | null>;
}
  
export interface createMacroNutrientProgressOnDateProps {
    (date: Dayjs, goalCalories: number,goalProtein: number, goalCarbs: number,goalFats: number): Promise<boolean | null>
}

export interface FoodEntry {
    id: number,
    date: Dayjs,
    foodName: string,
    totalCalories: number,
    totalProtein: number,
    totalFats: number,
    totalCarbs: number,
    foodWeight: number,
}

export interface FoodEntryAPIResponse {
    id: number,
    user_id: number,
    date: string,
    food_name: string,
    total_calories: number,
    total_protein: number,
    total_fats: number,
    total_carbs: number,
    food_weight: number,
}

export interface getFoodEntriesOnDateProps {
    (date: Dayjs) : Promise<FoodEntry[]>
}

export interface PatchBody {
    foodName?: string,
    totalCalories?: number,
    totalProtein?: number,
    totalFats?: number,
    totalCarbs?: number,
    foodWeight?: number,
}
