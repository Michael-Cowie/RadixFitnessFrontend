import dayjs, { Dayjs } from 'dayjs';
import { get, patch, post } from 'services/DataService';

import { WeightGoal } from './goalWeightOnDateInterface';

export const getGoalWeightOnDate = async (): Promise<WeightGoal | null> => {
    /**
     * Retrieve the current users goal weight on date, else null.
     */
    try {
        const response = await get("/api/v1/measurements/weights/goal_weight/");

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

export const createGoalWeightOnDate = async (goalDate: Dayjs, goalWeightKg: number) => {
  /**
   * Create a users goal weight on date entry.
   */
  const body = {
    'goal_date': goalDate.format("YYYY-MM-DD"),
    'goal_weight_kg': goalWeightKg
  }
  try {
      const response = await post("/api/v1/measurements/weights/", body);
  
      return response.status === 201 ? response.data : null
    } catch (error) {
      return null;
  }
};

/**
 * 
 * @param goalDate Dayjs object representing the users new goal date.
 * @param goalWeight Currently chosen goal weight.
 * @param displayUnit Current unit that the goalWeight is in.
 * @returns 200 success or null.
 */
export const updateGoalWeightOnDate = async (goalDate: Dayjs, goalWeightKg: number) => {
  const body = {
    'goal_date': goalDate.format("YYYY-MM-DD"),
    'goal_weight_kg': goalWeightKg
  }

  try {
      const response = await patch("/api/v1/measurements/weights/goal_weight/", body);
  
      return response.status === 200 ? true : null
    } catch (error) {
      return null;
  }
}
