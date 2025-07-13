import { FoodEntryCreation } from 'context/FoodIntakeTracking/FoodIntakeTrackingInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import { del, get, patch, post, put } from 'services/DataService';

import {
    createMacroNutrientProgressOnDateProps, FoodEntry, FoodEntryAPIResponse,
    getFoodEntriesOnDateProps, GetMacroNutrientProgressOnDateProps, PatchBody
} from './dailyIntakeTrackingInterface';

const GOALS_ENDPOINT = "api/v1/goals/"
const MACRONUTRIENT_PROGRESS_ENDPOINT = GOALS_ENDPOINT + "macronutrient/daily/";

const INTAKE_ENDPOINT = '/api/v1/intake/';
const FOOD_ENTRIES_ENDPOINT = INTAKE_ENDPOINT + "foods/";

/**
 * Retrieves the macronutrient progress on the provided date.
 * 
 * @param { Dayjs } date -  Dayjs object for the desired date.
 */
export const getMacroNutrientProgressOnDate: GetMacroNutrientProgressOnDateProps = async (date) => {
    try {
        const response = await get(MACRONUTRIENT_PROGRESS_ENDPOINT, { date: date.format("YYYY-MM-DD")});

        const successful = response.status === 200;
        if (successful) {
          return response.data
        }
        return null;
      } catch (error) {
        return null;
      }
};


/**
 * Created or update the macronutrient intake progress on a specific date.
 * 
 * @param { dayjs.Dayjs } date - The date for which the progress is being updated.
 * @param { number } goalCalories - The goal calorie intake.
 * @param { number } goalProtein - The goal protein intake.
 * @param { number } goalCarbs - The goal carbohydrate intake.
 * @param { number } goalFats - The goal fat intake.
 * @returns { Promise<boolean> } - A promise that resolves to a boolean indicating success.
 */
export const createUpdateMacroNutrientProgressOnDate: createMacroNutrientProgressOnDateProps = async (
  date, goalCalories, goalProtein,  goalCarbs, goalFats
): Promise<boolean> => {
  try {
      const response = await put(
        MACRONUTRIENT_PROGRESS_ENDPOINT, 
          {
            date: date.format("YYYY-MM-DD"), 
            goal_calories: goalCalories,
            goal_protein: goalProtein,
            goal_carbs: goalCarbs,
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

const remapEntryCase = (entry: FoodEntryAPIResponse): FoodEntry =>  {
  return {
    date: dayjs(entry.date),
    id: entry.id,
    foodName: entry.food_name,
    totalCalories: entry.total_calories,
    totalProtein: entry.total_protein,
    totalFats: entry.total_fats,
    totalCarbs: entry.total_carbs,
    foodWeight: entry.food_weight
  }; 
}

/**
 * Retrieves all user food entries on the provided date.
 * 
 * @param {Dayjs} date - Dayjs object for the desired date.
 * @returns {Promise<FoodEntry[]>} - An array of food entries or an empty array if the request fails.
 */
export const getFoodEntriesOnDate: getFoodEntriesOnDateProps = async (date: Dayjs): Promise<FoodEntry[]> => {
  try {
    const response = await get(FOOD_ENTRIES_ENDPOINT, {date: date.format("YYYY-MM-DD")})
    if (response.status === 200) {
      const mappedData = response.data.map((entry: FoodEntryAPIResponse) => {
        return remapEntryCase(entry);
      });
      return mappedData;
    }

    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Creates a food entry on the provided date.
 * 
 * @param {Dayjs} date - Dayjs object representing the desired date.
 * @param {FoodEntry} foodEntry - The food entry data to be created.
 * @returns {Promise<FoodEntry | null>} - The created food entry or null if the request fails.
 */
export const createFoodEntryOnDate = async (date: Dayjs, foodEntry: FoodEntryCreation): Promise<FoodEntry | null> => {
  try {

    const body = {
      food_name: foodEntry.foodName,
      total_calories: foodEntry.totalCalories,
      total_protein: foodEntry.totalProtein,
      total_fats: foodEntry.totalFats,
      total_carbs: foodEntry.totalCarbs,
      food_weight: foodEntry.foodWeight,
    }
    const response = await post(FOOD_ENTRIES_ENDPOINT, body, {date: date.format("YYYY-MM-DD")});
    if (response.status === 201) {
      return remapEntryCase(response.data);
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Updates an existing food entry with the provided data.
 *
 * @param {number} foodEntryId - The ID of the food entry to update.
 * @param {PatchBody} updateData - The data to update the food entry with.
 * @returns {Promise<boolean>} - A promise that resolves to true if the update was successful, otherwise false.
 */
export const updateExistingFoodEntry = async (foodEntryId: number, updateData: PatchBody): Promise<boolean> => {
  try {
    const response = await patch(INTAKE_ENDPOINT, updateData, {id: foodEntryId});
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Deletes a food entry by its ID.
 *
 * @param {number} foodEntryId - The ID of the food entry to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the deletion was successful, otherwise false.
 */
export const deleteFoodEntry = async (foodEntryId: number): Promise<boolean> => {
  try {
    const response = await del(FOOD_ENTRIES_ENDPOINT, {id: foodEntryId});
    return response.status === 204;
  } catch (error) {
    return false;
  }
}
