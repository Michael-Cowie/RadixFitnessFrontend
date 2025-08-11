import dayjs, { Dayjs } from 'dayjs';
import { createContext, useCallback, useEffect, useState } from 'react';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';
import {
  createFoodEntryOnDate,
  createUpdateMacroNutrientProgressOnDate,
  deleteFoodEntry,
} from 'services/DailyIntakeTracking/dailyIntakeTrackingService';

import * as Sentry from '@sentry/react';

import {
  FoodEntryCreation,
  FoodIntakeTrackingContextParameters,
  Props,
  SelectedDateView,
} from './FoodIntakeTrackingInterfaces';
import { assertDayView, getProgressAndEntryForDate, isDayView } from './FoodIntakeTrackingUtils';
import { getTodayDayjs } from 'lib/dateUtils';
import { getWeekLongMacronutrientSummary } from 'services/Analytics/analyticsService';

const dailyRecommendedIntake: Record<string, number> = {
  Calories: 2000,
  Protein: 50,
  Carbs: 275,
  Fats: 70,
};

const defaultNutrientProgressValues = {
  goalCalories: dailyRecommendedIntake.Calories,
  goalProtein: dailyRecommendedIntake.Protein,
  goalCarbs: dailyRecommendedIntake.Carbs,
  goalFats: dailyRecommendedIntake.Fats,
};

const today = getTodayDayjs();

export const FoodIntakeTrackingContext = createContext<FoodIntakeTrackingContextParameters>({
  selectedView: { type: 'day', day: today },
  setSelectedView: () => {},

  weekStart: today.startOf('week'),
  setWeekStart: () => {},

  getMacronutrientWeeklySummary: async () =>
    Promise.resolve({
      startDate: today,
      endDate: today.add(7, 'day'),
      daysWithLogs: 0,
      summary: {
        calories: {
          totalConsumed: 0,
          totalGoal: 0,
          averageConsumed: 0,
          averageGoal: 0,
          percentageOfGoal: 0,
        },
        protein: {
          totalConsumed: 0,
          totalGoal: 0,
          averageConsumed: 0,
          averageGoal: 0,
          percentageOfGoal: 0,
        },
        carbs: {
          totalConsumed: 0,
          totalGoal: 0,
          averageConsumed: 0,
          averageGoal: 0,
          percentageOfGoal: 0,
        },
        fats: {
          totalConsumed: 0,
          totalGoal: 0,
          averageConsumed: 0,
          averageGoal: 0,
          percentageOfGoal: 0,
        },
      },
    }),

  isLoading: true,

  goalCalories: defaultNutrientProgressValues.goalCalories,
  setGoalCalories: () => {},
  goalProtein: defaultNutrientProgressValues.goalProtein,
  setGoalProtein: () => {},
  goalCarbs: defaultNutrientProgressValues.goalCarbs,
  setGoalCarbs: () => {},
  goalFats: defaultNutrientProgressValues.goalFats,
  setGoalFats: () => {},

  foodEntries: [],
  createFoodEntry: () => Promise.resolve(),
  deleteFoodEntryWithID: () => Promise.resolve(),
});

export const FoodIntakeTrackingContextComponent: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedView, setSelectedView] = useState<SelectedDateView>({ type: 'day', day: dayjs() });
  const [weekStart, setWeekStart] = useState<Dayjs>(
    selectedView.type === 'day' ? selectedView.day.startOf('week') : dayjs().startOf('week'),
  );

  const [goalCalories, setGoalCalories] = useState<number>(
    defaultNutrientProgressValues.goalCalories,
  );
  const [goalProtein, setGoalProtein] = useState<number>(defaultNutrientProgressValues.goalProtein);
  const [goalCarbs, setGoalCarbs] = useState<number>(defaultNutrientProgressValues.goalCarbs);
  const [goalFats, setGoalFats] = useState<number>(defaultNutrientProgressValues.goalFats);

  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  const loadDayData = useCallback((date: Dayjs) => {
    setIsLoading(true);

    getProgressAndEntryForDate(date)
      .then(({ progress, entries }) => {
        setGoalCalories(progress.goalCalories);
        setGoalProtein(progress.goalProtein);
        setGoalCarbs(progress.goalCarbs);
        setGoalFats(progress.goalFats);
        setFoodEntries(entries);
      })
      .catch(() => {
        setGoalCalories(defaultNutrientProgressValues.goalCalories);
        setGoalProtein(defaultNutrientProgressValues.goalProtein);
        setGoalCarbs(defaultNutrientProgressValues.goalCarbs);
        setGoalFats(defaultNutrientProgressValues.goalFats);
        setFoodEntries([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isDayView(selectedView)) {
      loadDayData(selectedView.day);
    }
  }, [selectedView, loadDayData]);

  useEffect(() => {
    if (isDayView(selectedView)) {
      const ws = selectedView.day.startOf('week');
      if (!ws.isSame(weekStart, 'day')) setWeekStart(ws);
    }
  }, [selectedView, weekStart]);

  useEffect(() => {
    if (isDayView(selectedView)) {
      createUpdateMacroNutrientProgressOnDate(
        selectedView.day,
        goalCalories,
        goalProtein,
        goalCarbs,
        goalFats,
      ).catch(Sentry.captureException);
    }
  }, [goalCalories, goalProtein, goalCarbs, goalFats, selectedView]);

  const createFoodEntry = async (rowEntry: FoodEntryCreation): Promise<void> => {
    assertDayView(selectedView);

    await createFoodEntryOnDate(selectedView.day, rowEntry)
      .then((newEntry) => {
        const updatedEntries = [...foodEntries, newEntry];
        setFoodEntries(updatedEntries);
      })
      .catch(Sentry.captureException);
  };

  const deleteFoodEntryWithID = async (entryID: number): Promise<void> => {
    assertDayView(selectedView);

    await deleteFoodEntry(entryID)
      .then(() => {
        const updatedEntries = foodEntries.filter((e) => e.id !== entryID);
        setFoodEntries(updatedEntries);
      })
      .catch(Sentry.captureException);
  };

  const getMacronutrientWeeklySummaryWrapper = useCallback(async (startDate: Dayjs) => {
    setIsLoading(true);
    return await getWeekLongMacronutrientSummary(startDate).finally(() => setIsLoading(false));
  }, []);

  return (
    <FoodIntakeTrackingContext.Provider
      value={{
        selectedView,
        setSelectedView,

        weekStart,
        setWeekStart,

        getMacronutrientWeeklySummary: getMacronutrientWeeklySummaryWrapper,

        isLoading,

        goalCalories,
        setGoalCalories,
        goalProtein,
        setGoalProtein,
        goalCarbs,
        setGoalCarbs,
        goalFats,
        setGoalFats,

        foodEntries,
        createFoodEntry,
        deleteFoodEntryWithID,
      }}
    >
      {children}
    </FoodIntakeTrackingContext.Provider>
  );
};
