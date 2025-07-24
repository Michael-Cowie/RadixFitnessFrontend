import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';

export interface FoodIntakeTrackingContextParameters {
  selectedDate: Dayjs;
  setSelectedDate: (selectedDate: Dayjs) => void;

  isLoading: boolean;

  goalCalories: number;
  setGoalCalories: (newGoalCalories: number) => void;

  goalProtein: number;
  setGoalProtein: (newGoalProtein: number) => void;

  goalCarbs: number;
  setGoalCarbs: (newGoalCarbs: number) => void;

  goalFats: number;
  setGoalFats: (newGoalFats: number) => void;

  foodEntries: FoodEntry[];
  createFoodEntry: (foodEntry: FoodEntryCreation) => Promise<void>;
  deleteFoodEntryWithID: (entryID: number) => Promise<void>;
}

export interface FoodEntryCreation {
  foodName: string;
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  foodWeight: number;
}

export interface Props {
  children: ReactNode;
}
