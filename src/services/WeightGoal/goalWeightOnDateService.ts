import dayjs, { Dayjs } from 'dayjs';
import { get, put } from 'services/DataService';

import { WeightGoal } from './goalWeightOnDateInterface';

const END_POINT_PATH = "/api/v1/goals/weight/";

export const getGoalWeightOnDate = async (): Promise<WeightGoal | null> => {
    /**
     * Retrieve the current users goal weight on date, else null.
     */
    try {
        const response = await get(END_POINT_PATH);

        if (response.status === 200) {
          return {
            goalDate: dayjs(response.data.goal_date),
            goalWeightKg: response.data.goal_weight_kg 
          }
        }
        return null;
      } catch (error) {
        return null;
    }
}


/**
 * 
 * @param goalDate Dayjs object representing the users new goal date.
 * @param goalWeight Currently chosen goal weight.
 * @param displayUnit Current unit that the goalWeight is in.
 * @returns 200 success or null.
 */
export const setGoalWeightOnDate = async (goalDate: Dayjs, goalWeightKg: number) => {
  /**
   * Sets the user's goal weight for a specific date.
   * This will create a new record or update the existing one.
   */
  const body = {
    goal_date: goalDate.format("YYYY-MM-DD"),
    goal_weight_kg: goalWeightKg,
  };

  try {
    const response = await put(END_POINT_PATH, body);
    return response.status === 200 ? true : null;
  } catch (error) {
    return null;
  }
};
