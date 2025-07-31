import dayjs, { Dayjs } from 'dayjs';
import { createContext, useEffect, useState } from 'react';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';
import {
  createFoodEntryOnDate,
  createUpdateMacroNutrientProgressOnDate,
  deleteFoodEntry,
  getFoodEntriesOnDate,
  getMacroNutrientProgressOnDate,
} from 'services/DailyIntakeTracking/dailyIntakeTrackingService';

import * as Sentry from '@sentry/react';

import {
  FoodEntryCreation,
  FoodIntakeTrackingContextParameters,
  Props,
} from './FoodIntakeTrackingInterfaces';

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

export const FoodIntakeTrackingContext = createContext<FoodIntakeTrackingContextParameters>({
  selectedDate: dayjs(),
  setSelectedDate: () => {},

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

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const [goalCalories, setGoalCalories] = useState<number>(
    defaultNutrientProgressValues.goalCalories,
  );
  const [goalProtein, setGoalProtein] = useState<number>(defaultNutrientProgressValues.goalProtein);
  const [goalCarbs, setGoalCarbs] = useState<number>(defaultNutrientProgressValues.goalCarbs);
  const [goalFats, setGoalFats] = useState<number>(defaultNutrientProgressValues.goalFats);

  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  const createFoodEntry = async (rowEntry: FoodEntryCreation): Promise<void> => {
    const newEntry = await createFoodEntryOnDate(selectedDate, rowEntry);
    setFoodEntries([...foodEntries, newEntry]);
  };

  const deleteFoodEntryWithID = (entryID: number): Promise<void> => {
    return deleteFoodEntry(entryID).then(() => {
      setFoodEntries(foodEntries.filter((foodEntry) => foodEntry.id !== entryID));
    });
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getMacroNutrientProgressOnDate(selectedDate), getFoodEntriesOnDate(selectedDate)])
      .then(([goal_macronutrients, food_entries]) => {
        setGoalCalories(goal_macronutrients.goal_calories);
        setGoalProtein(goal_macronutrients.goal_protein);
        setGoalCarbs(goal_macronutrients.goal_carbs);
        setGoalFats(goal_macronutrients.goal_fats);

        setFoodEntries(food_entries);
      })
      .catch((error) => {
        Sentry.captureException(error);

        setGoalCalories(defaultNutrientProgressValues.goalCalories);
        setGoalProtein(defaultNutrientProgressValues.goalProtein);
        setGoalCarbs(defaultNutrientProgressValues.goalCarbs);
        setGoalFats(defaultNutrientProgressValues.goalFats);

        setFoodEntries([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedDate]);

  useEffect(() => {
    if (!isLoading) {
      createUpdateMacroNutrientProgressOnDate(
        selectedDate,
        goalCalories,
        goalProtein,
        goalCarbs,
        goalFats,
      ).catch((error) => {
        Sentry.captureException(error);
      });
    }
  }, [goalCalories, goalProtein, goalCarbs, goalFats, isLoading, selectedDate]);

  return (
    <FoodIntakeTrackingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,

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
