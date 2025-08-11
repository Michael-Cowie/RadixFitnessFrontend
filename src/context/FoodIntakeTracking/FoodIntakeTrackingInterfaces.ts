import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';

export type DayView = Extract<SelectedDateView, { type: 'day' }>;
export type WeeklySummaryView = Extract<SelectedDateView, { type: 'weeklySummary' }>;

export type SelectedDateView = { type: 'day'; day: Dayjs } | { type: 'weeklySummary' };

export interface FoodIntakeTrackingContextParameters {
  selectedView: SelectedDateView;
  setSelectedView: (view: SelectedDateView) => void;

  weekStart: Dayjs;
  setWeekStart: (d: Dayjs) => void;

  getMacronutrientWeeklySummary: (d: Dayjs) => Promise<MacronutrientAnalyticsSummary>;

  isLoading: boolean;

  goalCalories: number;
  setGoalCalories: (n: number) => void;
  goalProtein: number;
  setGoalProtein: (n: number) => void;
  goalCarbs: number;
  setGoalCarbs: (n: number) => void;
  goalFats: number;
  setGoalFats: (n: number) => void;

  foodEntries: FoodEntry[];
  createFoodEntry: (foodEntry: FoodEntryCreation) => Promise<void>;
  deleteFoodEntryWithID: (entryID: number) => Promise<void>;
}

export interface CachedData {
  progress: {
    goalCalories: number;
    goalProtein: number;
    goalCarbs: number;
    goalFats: number;
  };
  entries: FoodEntry[];
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
