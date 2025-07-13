import { Dayjs } from 'dayjs';
import { get, patch, post } from 'services/DataService';

export const getAllWeights = async () => {
    /**
     * Retrieve all of the existing weight entries for the current user.
     */
    try {
        const response = await get("/api/v1/measurements/weights/history/");
    
        return response.status === 200 ? response.data : null
      } catch (error) {
        return null;
    }
}

export const createNewWeight = async (date: Dayjs, weight_kg: number, notes: string) => {
    /**
     * Create a weight entry for the current user on the specified date with the provided weight in kilograms.
     */
    const body = {
        'date': date.format("YYYY-MM-DD"),
        'weight_kg': weight_kg,
        'notes': notes
    }
    try {
        const response = await post("/api/v1/measurements/weights/", body);
    
        return response.status === 201 ? response.data : null
      } catch (error) {
        return null;
    }
};

export const updateWeight = async(date: Dayjs, weight_kg: number, notes: string): Promise<boolean> => {
    /**
     * Retrieve all of the existing weight entries for the current user.
     */
    const body = {
        'date': date.format("YYYY-MM-DD"),
        'weight_kg': weight_kg,
        'notes': notes
    }

    try {
        const response = await patch("/api/v1/measurements/weights/", body);
    
        return response.status === 200 ? true : false
      } catch (error) {
        return false;
    }
}
