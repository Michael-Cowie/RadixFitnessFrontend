import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';

export const pageSize = 6;

export interface TableProps {
  entries: FoodEntry[];
  foodMassUnit: AvailableFoodWeightUnits;
}

export interface EmptyCellsProps {
  amount: number;
}
