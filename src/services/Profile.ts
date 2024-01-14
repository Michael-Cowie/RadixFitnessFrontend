import { get, post } from "services/DataService";

export const getProfile = async () => {
    /**
     * Retrieves the current logged in user profile.
     * 
     * This is done by by sending a request to the backend and passing the
     * current user ID Token. The backend is responsible for extracting 
     * the UID from the JWT and correctly passing back the user profile.
     */
    try {
        const response = await get("http://localhost:8000/api/user_profile");
    
        return response.status === 200 ? response.data : null
      } catch (error) {
        return null;
      }
};

export const createProfile = async (name: string): Promise<boolean> => {
  /**
   * Create a user profile with the provided parameters.
   * 
   * @param { string } name -  The users name.
   */
  try {
      const response = await post(
          "http://localhost:8000/api/user_profile", 
          {"name": name}
      );

      return response.status === 201
    } catch (error) {
      return false;
  }
}
