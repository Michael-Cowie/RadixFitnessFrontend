import { get, patch, post } from 'services/DataService';

export const createNewWeight = async (date: string, weight_kg: string) => {
    /**
     * Create a weight entry for the current user on the specified date with the provided weight in kilograms.
     */
    const body = {
        'date': date,
        'weight_kg': weight_kg
    }
    try {
        const response = await post("http://localhost:8000/api/v1/measurements/weights/", body);
    
        return response.status === 201 ? response.data : null
      } catch (error) {
        return null;
    }
};

export const getAllWeights = async () => {
    /**
     * Retrieve all of the existing weight entries for the current user.
     */
    try {
        const response = await get("http://localhost:8000/api/v1/measurements/weights/all/");
    
        return response.status === 200 ? response.data : null
      } catch (error) {
        return null;
    }
}

export const updateWeight = async(date: string, weight_kg: string): Promise<boolean> => {
    /**
     * Retrieve all of the existing weight entries for the current user.
     */
    const body = {
        'date': date,
        'weight_kg': weight_kg
    }

    try {
        const response = await patch("http://localhost:8000/api/v1/measurements/weights/", body);
    
        return response.status === 200 ? true : false
      } catch (error) {
        return false;
    }
}