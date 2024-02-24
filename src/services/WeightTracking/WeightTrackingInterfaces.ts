export type MeasurementSystem = "Metric" | "Imperial";
export type AvailableWeightUnits = "kg" | "lbs";

export interface WeightEntry {
    id: number,
    date: string, // YYYY-MM-DD
    weight_kg: number,
    notes: string,
    user_id: number
}
