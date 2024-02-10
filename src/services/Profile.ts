import { get, patch, post } from 'services/DataService';

export const getProfile = async () => {
    /**
     * Retrieves the current logged in user profile.
     * 
     * This is done by by sending a request to the backend and passing the
     * current user ID Token. The backend is responsible for extracting 
     * the UID from the JWT and correctly passing back the user profile.
     */
    try {
        const response = await get("http://localhost:8000/api/v1/profile/");
    
        return response.status === 200 ? response.data : null
      } catch (error) {
        return null;
      }
};

export const createProfile = async (name: string, measurement_system: string): Promise<boolean> => {
  /**
   * Create a user profile with the provided parameters.
   * 
   * @param { string } name -  The users name.
   * @param { string } measurement_system - The default unit used through the application.
   */
  try {
      const response = await post(
          "http://localhost:8000/api/v1/profile/", 
          {
            "name": name, 
            "measurement_system": measurement_system
          }
      );

      return response.status === 201
    } catch (error) {
      return false;
  }
}

export const updateProfile = async (name: string, measurement_system: string) => {
    /**
   * Update a user profile with the provided parameters.
   * 
   * @param { string } name -  The users name.
   * @param { string } measurement_system - The default unit used through the application.
   */
    try {
      const response = await patch(
          "http://localhost:8000/api/v1/profile/", 
          {
            "name": name, 
            "measurement_system": measurement_system
          }
      );

      return response.status === 200
    } catch (error) {
      return false;
  }
}