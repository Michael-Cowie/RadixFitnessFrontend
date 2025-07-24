import { get, put } from 'services/DataService';

import { UserProfile } from 'services/Profile/ProfileInterfaces';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

const END_POINT_PATH = '/api/v1/profile/';

/**
 * Retrieves the current logged in user profile.
 *
 * This is done by sending a request to the backend and passing the
 * current user ID Token. The backend is responsible for extracting
 * the UID from the JWT and correctly passing back the user profile.
 *
 * @returns {Promise<UserProfile>} - Resolves with user profile data.
 * @throws {Error} - If the request fails or response is not 200.
 */
export const getProfile = async (): Promise<UserProfile> => {
  const response = await get(END_POINT_PATH);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch profile. Status: ${response.status}`);
  }

  return response.data as UserProfile;
};

/**
 * Create or update a user profile with the provided parameters.
 *
 * @param {string} name - The user's name.
 * @param {MeasurementSystem} measurementSystem - The default unit used through the application.
 * @returns {Promise<void>} - Resolves if the update was successful, otherwise throws.
 */
export const saveProfile = async (
  name: string,
  measurementSystem: MeasurementSystem,
): Promise<void> => {
  const response = await put(END_POINT_PATH, {
    name,
    measurement_system: measurementSystem,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to save profile. Status: ${response.status}`);
  }
};
