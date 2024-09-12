import dayjs, { Dayjs } from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { FoodEntry } from 'services/DailyIntakeTracking/dailyIntakeTrackingInterface';
import {
    createFoodEntryOnDate, createUpdateMacroNutrientProgressOnDate, deleteFoodEntry,
    getFoodEntriesOnDate, getMacroNutrientProgressOnDate
} from 'services/DailyIntakeTracking/dailyIntakeTrackingService';

import {
    FoodEntryCreation, FoodIntakeTrackingContextParameters, Props
} from './FoodIntakeTrackingInterfaces';

const dailyRecommendedIntake: Record<string, number> = {
    Calories: 2000,
    Protein: 50,
    Carbs: 275,
    Fats: 70
};

const defaultNutrientProgressValues = {
    goalCalories: dailyRecommendedIntake.Calories,
    goalProtein: dailyRecommendedIntake.Protein,
    goalCarbs: dailyRecommendedIntake.Carbs,
    goalFats: dailyRecommendedIntake.Fats,
};

const FoodIntakeTrackingContext = createContext<FoodIntakeTrackingContextParameters>({
    selectedDate: dayjs(),
    setSelectedDate: (newSelectedDate) => null,

    isLoading: true,

    goalCalories: defaultNutrientProgressValues.goalCalories,
    setGoalCalories: (newGoalCalories) => null,

    goalProtein: defaultNutrientProgressValues.goalProtein,
    setGoalProtein: (newGoalProtein) => null,

    goalCarbs: defaultNutrientProgressValues.goalCarbs,
    setGoalCarbs: (newGoalCarbs) => null,

    goalFats: defaultNutrientProgressValues.goalFats,
    setGoalFats: (newGoalFats) => null,

    foodEntries: [],
    createFoodEntry: (foodEntry: FoodEntryCreation) => Promise.resolve(false),
    deleteFoodEntryWithID: (entryID: number) => Promise.resolve(false),
});

export const FoodIntakeTrackingContextComponent: React.FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const [goalCalories, setGoalCalories] = useState<number>(defaultNutrientProgressValues.goalCalories);
    const [goalProtein, setGoalProtein] = useState<number>(defaultNutrientProgressValues.goalProtein)
    const [goalCarbs, setGoalCarbs] = useState<number>(defaultNutrientProgressValues.goalCarbs)
    const [goalFats, setGoalFats] = useState<number>(defaultNutrientProgressValues.goalFats);

    const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

    const createFoodEntry = async (rowEntry: FoodEntryCreation): Promise<boolean> => {
        try{
            const result = await createFoodEntryOnDate(selectedDate, rowEntry);
            if (result) {
                setFoodEntries([...foodEntries, result]);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    const deleteFoodEntryWithID = async (entryID: number) => {
        const success = await deleteFoodEntry(entryID);
        if (success) {
            setFoodEntries(foodEntries.filter(foodEntry => foodEntry.id !== entryID));
            return true;
        }
        return false;
    }

    useEffect(() => {
        setIsLoading(true);

        const initializeStatesFromDate = async () => {
            try {
                /**
                 * Each promise can execute independently as it does not rely
                 * on the result of the each.
                 */
                const [macroNutrientProgressResult, foodEntriesResult] = await Promise.all([
                    getMacroNutrientProgressOnDate(selectedDate),
                    getFoodEntriesOnDate(selectedDate)
                ]);
        
                if (macroNutrientProgressResult) {
                    setGoalCalories(macroNutrientProgressResult.goal_calories);
                    setGoalProtein(macroNutrientProgressResult.goal_protein);
                    setGoalCarbs(macroNutrientProgressResult.goal_carbs);
                    setGoalFats(macroNutrientProgressResult.goal_fats);
                } else {
                    setGoalCalories(defaultNutrientProgressValues.goalCalories);
                    setGoalProtein(defaultNutrientProgressValues.goalProtein);
                    setGoalCarbs(defaultNutrientProgressValues.goalCarbs);
                    setGoalFats(defaultNutrientProgressValues.goalFats);
                }
        
                if (foodEntriesResult) {
                    setFoodEntries(foodEntriesResult);
                }
            } finally {
                setIsLoading(false);
            }
        }

        initializeStatesFromDate();

    }, [selectedDate])

    useEffect(() => {
        /*
            When any of the progress states have been changed, create or update the row.

            Make sure to not perform this when loading. The problem that occurred was
            during initial mounting, it would immediately call this useEffect and reset
            the values back to the default values.
        */
        if (!isLoading) {
            createUpdateMacroNutrientProgressOnDate(
                selectedDate, 
                goalCalories, 
                goalProtein, 
                goalCarbs, 
                goalFats
            )
        }
    }, [goalCalories, goalProtein, goalCarbs, goalFats])

    return (
        <FoodIntakeTrackingContext.Provider value={
            {
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
            }
        }>
            { children }
        </FoodIntakeTrackingContext.Provider>
    )
}

const useFoodIntakeTrackingContext = () => {
    return useContext(FoodIntakeTrackingContext);
}

export default useFoodIntakeTrackingContext;