import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';

export const pageSize = 6;

export interface TableProps {
    entries: FoodEntry[];
    handleContextMenu: (event: React.MouseEvent, entryId: number, foodName: string) => void;
}
  
export interface EmptyCellsProps {
    amount: number
}
  