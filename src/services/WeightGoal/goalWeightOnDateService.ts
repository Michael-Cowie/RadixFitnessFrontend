import dayjs, { Dayjs } from 'dayjs';
import { get, put } from 'services/DataService';

import { WeightGoal } from './goalWeightOnDateInterface';
import { formatDayjsForApi } from 'services/apiFormatters';

const END_POINT_PATH = '/api/v1/goals/weight/';

/**
 * Retrieve the current user's goal weight on date.
 *
 * @returns {Promise<WeightGoal>} - Resolves with the goal weight data.
 * @throws {Error} - If the request fails or response is not 200.
 */
export const getGoalWeightOnDate = async (): Promise<WeightGoal> => {
  const response = await get(END_POINT_PATH);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch goal weight. Status: ${response.status}`);
  }

  return {
    goalDate: dayjs(response.data.goal_date),
    goalWeightKg: parseFloat(response.data.goal_weight_kg),
  };
};

/**
 * Saves the user's goal weight on the specified date.
 *
 * @param goalDate - Dayjs object representing the user's new goal date.
 * @param goalWeightKg - Goal weight in kilograms.
 * @returns {Promise<void>} - Resolves if successful, otherwise throws.
 */
export const saveGoalWeightKgOnDate = async (
  goalDate: Dayjs,
  goalWeightKg: number,
): Promise<void> => {
  const body = {
    goal_date: formatDayjsForApi(goalDate),
    goal_weight_kg: goalWeightKg,
  };

  const response = await put(END_POINT_PATH, body);

  if (response.status !== 200) {
    throw new Error(`Failed to save goal weight. Status: ${response.status}`);
  }
};
