import { Dayjs } from 'dayjs';
import {
  CachedData,
  DayView,
  SelectedDateView,
  WeeklySummaryView,
} from './FoodIntakeTrackingInterfaces';
import {
  getFoodEntriesOnDate,
  getMacroNutrientProgressOnDate,
} from 'services/DailyIntakeTracking/dailyIntakeTrackingService';

import * as Sentry from '@sentry/react';

export function isDayView(view: SelectedDateView): view is DayView {
  return view.type === 'day';
}

export function isWeeklySummaryView(view: SelectedDateView): view is WeeklySummaryView {
  return view.type === 'weeklySummary';
}

export function assertDayView(view: SelectedDateView): asserts view is DayView {
  if (view.type !== 'day') {
    throw new Error('Expected day view for API requests');
  }
}

export function assertWeeklySummaryView(view: SelectedDateView): asserts view is WeeklySummaryView {
  if (view.type !== 'weeklySummary') {
    throw new Error('Expected weekly summary view this page');
  }
}

export const getProgressAndEntryForDate = async (date: Dayjs): Promise<CachedData> => {
  return await Promise.all([getMacroNutrientProgressOnDate(date), getFoodEntriesOnDate(date)])
    .then(([progress, entries]) => {
      const parsedProgress = {
        goalCalories: progress.goal_calories,
        goalProtein: progress.goal_protein,
        goalCarbs: progress.goal_carbs,
        goalFats: progress.goal_fats,
      };

      return { progress: parsedProgress, entries };
    })
    .catch((error) => {
      Sentry.captureException(error);
      throw error;
    });
};
