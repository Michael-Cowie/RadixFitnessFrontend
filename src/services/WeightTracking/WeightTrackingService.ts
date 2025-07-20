import { get, put } from 'services/DataService';

const WEIGHT_END_POINT_PATH = '/api/v1/measurements/weights/';
const WEIGHT_HISTORY_END_POINT_PATH = WEIGHT_END_POINT_PATH + 'history/';

export const getAllWeights = async () => {
  /**
   * Retrieve all of the existing weight entries for the current user.
   */
  try {
    const response = await get(WEIGHT_HISTORY_END_POINT_PATH);

    return response.status === 200 ? response.data : null;
  } catch (error) {
    return null;
  }
};

export const saveWeightEntry = async (date: string, weightKg: number, notes: string) => {
  /**
   * Create a weight entry for the current user on the specified date with the provided weight in kilograms.
   */
  const body = {
    date: date,
    weight_kg: weightKg,
    notes: notes,
  };
  try {
    const response = await put(WEIGHT_END_POINT_PATH, body);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
