import dayjs from 'dayjs';
import { get, patch, post } from 'services/DataService';

import { WeightGoal } from './goalWeightOnDateInterface';

export const getGoalWeightOnDate = async (): Promise<WeightGoal | null> => {
    /**
     * Retrieve the current users goal weight on date, else null.
     */
    try {
        const response = await get("http://localhost:8000/api/v1/measurements/weights/goal_weight/");

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

export const createGoalWeightOnDate = async (goalDate: string, goalWeight: number) => {
  /**
   * Create a users goal weight on date entry.
   */
  const body = {
    'goal_date_key': goalDate,
    'goal_weight_kg_key': goalWeight
  }
  try {
      const response = await post("http://localhost:8000/api/v1/measurements/weights/", body);
  
      return response.status === 201 ? response.data : null
    } catch (error) {
      return null;
  }
};

export const updateGoalWeightOnDate = async (goalDate: string, goalWeight: number) => {
  /**
   * Update the users goal date or goal weight.
   */
  const body = {
    'goal_date_key': goalDate,
    'goal_weight_kg_key': goalWeight
  }

  try {
      const response = await patch("http://localhost:8000/api/v1/measurements/weights/goal_weight/", body);
  
      return response.status === 200 ? true : null
    } catch (error) {
      return null;
  }
}
