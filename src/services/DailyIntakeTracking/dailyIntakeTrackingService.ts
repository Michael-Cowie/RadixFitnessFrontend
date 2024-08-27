import { Dayjs } from 'dayjs';
import { get, put } from 'services/DataService';

const END_POINT_PATH = '/api/v1/food_intake_on_date/';

interface MacroNutrientProgress {
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

interface GetMacroNutrientProgressOnDateProps {
  (date: Dayjs): Promise<MacroNutrientProgress | null>;
}

interface createMacroNutrientProgressOnDateProps {
  (date: Dayjs, currentCalories: number, goalCalories: number, currentProtein: number, goalProtein: number,
    currentCarbs: number, goalCarbs: number, currentFats: number, goalFats: number): Promise<boolean | null>
}

export const getMacroNutrientProgressOnDate: GetMacroNutrientProgressOnDateProps = async (date) => {
    /**
     * Retrieves the macronutrient progress on the provided date.
     * 
     * @param { Dayjs } date -  Dayjs object for the desired date.
     */
    try {
        const response = await get(END_POINT_PATH + "macronutrient_progress/", { date: date.format("YYYY-MM-DD")});

        const successful = response.status === 200;
        if (successful) {
          return response.data
        }
        return null;
      } catch (error) {
        return null;
      }
};

export const createUpdateMacroNutrientProgressOnDate: createMacroNutrientProgressOnDateProps = async (
  date, currentCalories, goalCalories, currentProtein, goalProtein, currentCarbs,  goalCarbs, currentFats, goalFats
): Promise<boolean> => {
  /**
   * Created or update the macronutrient intake progress on a specific date.
   * 
   * @param { dayjs.Dayjs } date - The date for which the progress is being updated.
   * @param { number } currentCalories - The current calorie intake.
   * @param { number } goalCalories - The goal calorie intake.
   * @param { number } currentProtein - The current protein intake.
   * @param { number } goalProtein - The goal protein intake.
   * @param { number } currentCarbs - The current carbohydrate intake.
   * @param { number } goalCarbs - The goal carbohydrate intake.
   * @param { number } currentFats - The current fat intake.
   * @param { number } goalFats - The goal fat intake.
   * @returns { Promise<boolean> } - A promise that resolves to a boolean indicating success.
   */
  try {
      const response = await put(
        END_POINT_PATH + "macronutrient_progress/", 
          {
            date: date.format("YYYY-MM-DD"), 
            current_calories: currentCalories,
            goal_calories: goalCalories,
            current_protein: currentProtein,
            goal_protein: goalProtein,
            current_carbs: currentCarbs,
            goal_carbs: goalCarbs,
            current_fats: currentFats,
            goal_fats: goalFats
          }
      );
      const created = response.status === 201;
      const updated = response.status === 200;
      return created || updated;
    } catch (error) {
      return false;
  }
}

