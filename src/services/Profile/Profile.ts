import { get, put } from 'services/DataService';

const END_POINT_PATH = '/api/v1/profile/';

/**
 * Retrieves the current logged in user profile.
 *
 * This is done by by sending a request to the backend and passing the
 * current user ID Token. The backend is responsible for extracting
 * the UID from the JWT and correctly passing back the user profile.
 */
export const getProfile = async () => {
  try {
    const response = await get(END_POINT_PATH);

    return response.status === 200 ? response.data : null;
  } catch (error) {
    return null;
  }
};

/**
 * Create or update a user profile with the provided parameters.
 *
 * @param { string } name - The users name.
 * @param { string } measurement_system - The default unit used through the application.
 */
export const saveProfile = async (name: string, measurementSystem: string): Promise<boolean> => {
  try {
    const response = await put(END_POINT_PATH, {
      name: name,
      measurement_system: measurementSystem,
    });

    return response.status === 200;
  } catch {
    return false;
  }
};
