import LoadingButton from 'atoms/LoadingButton';
import ProgressBarWithCenteredText from 'atoms/ProgressBarWithCenteredText';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import React, { useEffect, useState } from 'react';
import {
    createUpdateMacroNutrientProgressOnDate, getMacroNutrientProgressOnDate
} from 'services/DailyIntakeTracking/dailyIntakeTrackingService';

import { MacroNutrientProgress, MacroNutrientRowProps } from './DailyMacroNutrientInterfaces';

const dailyRecommendedIntake: Record<string, number> = {
    Calories: 2000,
    Protein: 50,
    Carbs: 275,
    Fats: 70
};

const initialValues = {
    currentCalories: 0,
    currentProtein: 0,
    currentCarbs: 0,
    currentFats: 0,
    goalCalories: dailyRecommendedIntake.Calories,
    goalProtein: dailyRecommendedIntake.Protein,
    goalCarbs: dailyRecommendedIntake.Carbs,
    goalFats: dailyRecommendedIntake.Fats,
};


const MacroNutrientRow: React.FC<MacroNutrientRowProps> = ({ nutrientName, currentValue, maxValue, goalSetter }) => {
    return (
        <div className='flex flex-row w-full p-1'>
            <div className='w-20 font-bold'>
                { nutrientName }
            </div>
            <ProgressBarWithCenteredText value={currentValue} initialGoalValue={maxValue} onChange={ goalSetter }/>
        </div>
    )
}

const DailyMacroNutrientProgress = () => {
    const { selectedDate } = useFoodIntakeTrackingContext()

    const [isLoading, setIsLoading] = useState(true);

    const [currentCalories, setCurrentCalories] = useState<number>(initialValues.currentCalories);
    const [goalCalories, setGoalCalories] = useState<number>(initialValues.goalCalories);

    const [currentProtein, setCurrentProtein] = useState<number>(initialValues.currentProtein);
    const [goalProtein, setGoalProtein] = useState<number>(initialValues.goalProtein)

    const [currentCarbs, setCurrentCarbs] = useState<number>(initialValues.currentCarbs);
    const [goalCarbs, setGoalCarbs] = useState<number>(initialValues.goalCarbs)

    const [currentFats, setCurrentFats] = useState<number>(initialValues.currentFats);
    const [goalFats, setGoalFats] = useState<number>(initialValues.goalFats)

    const allGoalMacronutrientGoals = [
        {name: "Calories", currentProgress: currentCalories, goal: goalCalories, setter: setGoalCalories},
        {name: "Protein", currentProgress: currentProtein, goal: goalProtein, setter: setGoalProtein},
        {name: "Carbs", currentProgress: currentCarbs, goal: goalCarbs, setter: setGoalCarbs},
        {name: "Fats", currentProgress: currentFats, goal: goalFats, setter: setGoalFats}
    ]

    function setAll(data: MacroNutrientProgress) {
        setCurrentCalories(data.currentCalories)
        setGoalCalories(data.goalCalories)

        setCurrentProtein(data.currentProtein)
        setGoalProtein(data.goalProtein)

        setCurrentCarbs(data.currentCarbs)
        setGoalCarbs(data.goalCarbs)

        setCurrentFats(data.currentFats)
        setGoalFats(data.goalFats)
    }

    useEffect(() => {
        /*
            When the page has been rendered, attempt to initialize the progress from
            the current date.
        */
        setIsLoading(true);
        getMacroNutrientProgressOnDate(selectedDate)
        .then((result) => {
            if (result) {
                const newProgress = {
                    currentCalories: result.current_calories,
                    goalCalories: result.goal_calories,
                    currentProtein: result.current_protein,
                    goalProtein: result.goal_protein,
                    currentCarbs: result.current_carbs,
                    goalCarbs: result.goal_carbs,
                    currentFats: result.current_fats,
                    goalFats: result.goal_fats
                }
                setAll(newProgress);
            }
            setIsLoading(false);
        })
    },[selectedDate]);

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
                currentCalories, goalCalories, 
                currentProtein, goalProtein, 
                currentCarbs, goalCarbs, 
                currentFats, goalFats
            )
        }
    }, [currentCalories, goalCalories, currentProtein, goalProtein, currentCarbs, goalCarbs, currentFats, goalFats])

    return (
        <div className='flex flex-col h-40'>
            {isLoading ? (
                <LoadingButton buttonText='Loading' displayLoadingAnimation={true} />
            ) : (
                allGoalMacronutrientGoals.map((macronutrientGoal, i) => (
                    <MacroNutrientRow
                        key={i}
                        nutrientName={macronutrientGoal.name}
                        currentValue={macronutrientGoal.currentProgress}
                        maxValue={macronutrientGoal.goal}
                        goalSetter={macronutrientGoal.setter}
                    />
                ))
            )}
        </div>
    )
    
}


export default DailyMacroNutrientProgress;