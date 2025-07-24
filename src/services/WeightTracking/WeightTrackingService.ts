import { get, put } from 'services/DataService';
import { WeightEntry } from './WeightTrackingInterfaces';

const WEIGHT_END_POINT_PATH = '/api/v1/measurements/weights/';
const WEIGHT_HISTORY_END_POINT_PATH = WEIGHT_END_POINT_PATH + 'history/';

/**
 * Retrieve all of the existing weight entries for the current user.
 *
 * @returns {Promise<WeightEntry[]>} Resolves with array of weight entries if successful, rejects on error or non-200 response.
 */
export const getAllWeights = async (): Promise<WeightEntry[]> => {
  const response = await get(WEIGHT_HISTORY_END_POINT_PATH);

  if (response.status !== 200) {
    throw new Error('Failed to fetch weight history.');
  }

  return response.data as WeightEntry[];
};

/**
 * Create or update a weight entry for the current user on the specified date
 * with the provided weight in kilograms and optional notes.
 *
 * @param date - ISO-formatted string (e.g. '2025-07-10')
 * @param weightKg - Weight in kilograms
 * @param notes - Optional notes for the weight entry
 * @returns {Promise<void>} Resolves on success, throws on failure
 * @throws {Error} If the backend responds with a non-200 status
 */
export const saveWeightEntry = async (
  date: string,
  weightKg: number,
  notes: string,
): Promise<void> => {
  const body = {
    date,
    weight_kg: weightKg,
    notes,
  };

  const response = await put(WEIGHT_END_POINT_PATH, body);

  if (response.status !== 200) {
    throw new Error('Failed to save weight entry.');
  }
};
