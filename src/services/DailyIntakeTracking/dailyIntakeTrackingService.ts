import { FoodEntryCreation } from 'context/FoodIntakeTracking/FoodIntakeTrackingInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import { del, get, patch, post, put } from 'services/DataService';

import {
  createMacroNutrientProgressOnDateProps,
  FoodEntry,
  FoodEntryAPIResponse,
  getFoodEntriesOnDateProps,
  GetMacroNutrientProgressOnDateProps,
  PatchBody,
} from './dailyIntakeTrackingInterface';

const GOALS_ENDPOINT = '/api/v1/goals/';
const MACRONUTRIENT_PROGRESS_ENDPOINT = GOALS_ENDPOINT + 'macronutrient/daily/';

const INTAKE_ENDPOINT = '/api/v1/intake/';
const FOOD_ENTRIES_ENDPOINT = INTAKE_ENDPOINT + 'foods/';

/**
 * Retrieves the macronutrient progress on the provided date.
 *
 * @param {Dayjs} date - Dayjs object for the desired date.
 * @returns {Promise<MacronutrientProgress>} - Resolves with progress data if successful.
 * @throws {Error} - Throws if the request fails or response is not 200.
 */
export const getMacroNutrientProgressOnDate: GetMacroNutrientProgressOnDateProps = async (date) => {
  const response = await get(MACRONUTRIENT_PROGRESS_ENDPOINT, {
    date: date.format('YYYY-MM-DD'),
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch macro progress. Status: ${response.status}`);
  }

  return response.data;
};

/**
 * Creates or updates the macronutrient intake progress on a specific date.
 *
 * @param {dayjs.Dayjs} date - The date for which the progress is being updated.
 * @param {number} goalCalories - The goal calorie intake.
 * @param {number} goalProtein - The goal protein intake.
 * @param {number} goalCarbs - The goal carbohydrate intake.
 * @param {number} goalFats - The goal fat intake.
 * @returns {Promise<void>} - Resolves if update was successful, otherwise throws.
 */
export const createUpdateMacroNutrientProgressOnDate: createMacroNutrientProgressOnDateProps =
  async (date, goalCalories, goalProtein, goalCarbs, goalFats): Promise<void> => {
    const response = await put(MACRONUTRIENT_PROGRESS_ENDPOINT, {
      date: date.format('YYYY-MM-DD'),
      goal_calories: goalCalories,
      goal_protein: goalProtein,
      goal_carbs: goalCarbs,
      goal_fats: goalFats,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to update macro progress. Status: ${response.status}`);
    }
  };

const remapEntryCase = (entry: FoodEntryAPIResponse): FoodEntry => {
  return {
    date: dayjs(entry.date),
    id: entry.id,
    foodName: entry.food_name,
    totalCalories: entry.total_calories,
    totalProtein: entry.total_protein,
    totalFats: entry.total_fats,
    totalCarbs: entry.total_carbs,
    foodWeight: entry.food_weight,
  };
};

/**
 * Retrieves all user food entries on the provided date.
 *
 * @param {Dayjs} date - Dayjs object for the desired date.
 * @returns {Promise<FoodEntry[]>} - Resolves with array of food entries.
 * @throws {Error} - Throws if the request fails or status is not 200.
 */
export const getFoodEntriesOnDate: getFoodEntriesOnDateProps = async (
  date: Dayjs,
): Promise<FoodEntry[]> => {
  const response = await get(FOOD_ENTRIES_ENDPOINT, { date: date.format('YYYY-MM-DD') });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch food entries. Status: ${response.status}`);
  }

  return response.data.map(remapEntryCase);
};

/**
 * Creates a food entry on the provided date.
 *
 * @param {Dayjs} date - Dayjs object representing the desired date.
 * @param {FoodEntryCreation} foodEntry - The food entry data to be created.
 * @returns {Promise<FoodEntry>} - The newly created food entry.
 * @throws {Error} - If the creation fails or response is not 201.
 */
export const createFoodEntryOnDate = async (
  date: Dayjs,
  foodEntry: FoodEntryCreation,
): Promise<FoodEntry> => {
  const body = {
    food_name: foodEntry.foodName,
    total_calories: foodEntry.totalCalories,
    total_protein: foodEntry.totalProtein,
    total_fats: foodEntry.totalFats,
    total_carbs: foodEntry.totalCarbs,
    food_weight: foodEntry.foodWeight,
  };

  const response = await post(FOOD_ENTRIES_ENDPOINT, body, {
    date: date.format('YYYY-MM-DD'),
  });

  if (response.status !== 201) {
    throw new Error(`Failed to create food entry. Status: ${response.status}`);
  }

  return remapEntryCase(response.data);
};

/**
 * Updates an existing food entry with the provided data.
 *
 * @param {number} foodEntryId - The ID of the food entry to update.
 * @param {PatchBody} updateData - The data to update the food entry with.
 * @returns {Promise<void>} - Resolves if the update was successful, otherwise throws.
 * @throws {Error} - If the update fails or response status is not 200.
 */
export const updateExistingFoodEntry = async (
  foodEntryId: number,
  updateData: PatchBody,
): Promise<void> => {
  const response = await patch(INTAKE_ENDPOINT, updateData, { id: foodEntryId });

  if (response.status !== 200) {
    throw new Error(`Failed to update food entry. Status: ${response.status}`);
  }
};

/**
 * Deletes a food entry by its ID.
 *
 * @param {number} foodEntryId - The ID of the food entry to delete.
 * @returns {Promise<void>} - Resolves if the deletion was successful, otherwise throws.
 * @throws {Error} - If the deletion fails or status is not 204.
 */
export const deleteFoodEntry = async (foodEntryId: number): Promise<void> => {
  const response = await del(FOOD_ENTRIES_ENDPOINT, { id: foodEntryId });

  if (response.status !== 204) {
    throw new Error(`Failed to delete food entry. Status: ${response.status}`);
  }
};
