import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';

export const pageSize = 6;

export interface TableProps {
  entries: FoodEntry[];
}

export interface EmptyCellsProps {
  amount: number;
}
