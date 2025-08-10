import { Dayjs } from 'dayjs';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';
import {
  CachedData,
  DayView,
  MacronutrientSummary,
  SelectedDateView,
  WeeklySummary,
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

export const getCachedProgressAndEntries = (date: Dayjs): CachedData | null => {
  const key = `food-cache-${date.format('YYYY-MM-DD')}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setCachedProgressAndEntries = (
  date: Dayjs,
  progress: CachedData['progress'],
  entries: FoodEntry[],
) => {
  const key = `food-cache-${date.format('YYYY-MM-DD')}`;
  localStorage.setItem(key, JSON.stringify({ progress, entries }));
};

const fetchAndCacheProgressAndEntries = async (date: Dayjs): Promise<CachedData> => {
  return await Promise.all([getMacroNutrientProgressOnDate(date), getFoodEntriesOnDate(date)])
    .then(([progress, entries]) => {
      const parsedProgress = {
        goalCalories: progress.goal_calories,
        goalProtein: progress.goal_protein,
        goalCarbs: progress.goal_carbs,
        goalFats: progress.goal_fats,
      };

      setCachedProgressAndEntries(date, parsedProgress, entries);
      return { progress: parsedProgress, entries };
    })
    .catch((error) => {
      Sentry.captureException(error);
      throw error;
    });
};

export const getProgressAndEntryForDate = async (date: Dayjs): Promise<CachedData> => {
  const cached = getCachedProgressAndEntries(date);
  if (cached) return cached;

  return await fetchAndCacheProgressAndEntries(date);
};

export const buildWeeklySummary = async (date: Dayjs): Promise<WeeklySummary> => {
  const startOfWeek = date.startOf('week');
  const endOfWeek = startOfWeek.add(6, 'day');

  let daysWithLogs = 0;

  const nutrientTotals = {
    Calories: { consumed: 0, goal: 0 },
    Protein: { consumed: 0, goal: 0 },
    Carbs: { consumed: 0, goal: 0 },
    Fats: { consumed: 0, goal: 0 },
  };

  const dailyPromises = Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.add(i, 'day');

    return getProgressAndEntryForDate(day)
      .then(({ progress, entries }) => {
        if (entries.length > 0) {
          daysWithLogs += 1;
        }

        let dayCalories = 0;
        let dayProtein = 0;
        let dayCarbs = 0;
        let dayFats = 0;

        entries.forEach((entry: FoodEntry) => {
          dayCalories += entry.totalCalories;
          dayProtein += entry.totalProtein;
          dayCarbs += entry.totalCarbs;
          dayFats += entry.totalFats;
        });

        nutrientTotals.Calories.consumed += dayCalories;
        nutrientTotals.Protein.consumed += dayProtein;
        nutrientTotals.Carbs.consumed += dayCarbs;
        nutrientTotals.Fats.consumed += dayFats;

        nutrientTotals.Calories.goal += progress.goalCalories;
        nutrientTotals.Protein.goal += progress.goalProtein;
        nutrientTotals.Carbs.goal += progress.goalCarbs;
        nutrientTotals.Fats.goal += progress.goalFats;
      })
      .catch(Sentry.captureException);
  });

  await Promise.all(dailyPromises);

  const toSummary = (nutrient: keyof typeof nutrientTotals): MacronutrientSummary => {
    const total = nutrientTotals[nutrient];
    const averageConsumed = daysWithLogs === 0 ? 0 : total.consumed / daysWithLogs;
    const averageGoal = daysWithLogs === 0 ? 0 : total.goal / daysWithLogs;
    const percentageOfGoal = total.goal === 0 ? 0 : (total.consumed / total.goal) * 100;

    return {
      totalConsumed: total.consumed,
      totalGoal: total.goal,
      averageConsumed,
      averageGoal,
      percentageOfGoal,
    };
  };

  return {
    startDate: startOfWeek,
    endDate: endOfWeek,
    daysWithLogs,
    summary: {
      Calories: toSummary('Calories'),
      Protein: toSummary('Protein'),
      Carbs: toSummary('Carbs'),
      Fats: toSummary('Fats'),
    },
  };
};
