export type AvailableWeightUnits = 'kg' | 'lbs';

export const availableWeightUnits: AvailableWeightUnits[] = ['kg', 'lbs'];

export interface WeightEntry {
  user: number;
  date: string;
  weight_kg: number;
  notes: string;
}
