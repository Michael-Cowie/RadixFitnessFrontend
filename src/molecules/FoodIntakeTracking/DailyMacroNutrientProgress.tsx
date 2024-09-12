import LoadingButton from 'atoms/LoadingButton';
import ProgressBarWithCenteredText from 'atoms/ProgressBarWithCenteredText';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import React from 'react';

import { MacroNutrientRowProps } from './DailyMacroNutrientInterfaces';

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
    const { 
        isLoading,

        foodEntries,

        goalCalories,
        setGoalCalories,

        goalProtein,
        setGoalProtein,

        goalCarbs,
        setGoalCarbs,

        goalFats,
        setGoalFats,
    } = useFoodIntakeTrackingContext()

    let currentCalories = 0;
    let currentProtein = 0;
    let currentCarbs = 0;
    let currentFats = 0;

    for (let foodEntry of foodEntries) {
        currentCalories += foodEntry.totalCalories;
        currentProtein += foodEntry.totalProtein;
        currentCarbs += foodEntry.totalCarbs;
        currentFats += foodEntry.totalFats;
    }

    const allGoalMacronutrientGoals = [
        {name: "Calories", currentProgress: currentCalories, goal: goalCalories, setter: setGoalCalories},
        {name: "Protein", currentProgress: currentProtein, goal: goalProtein, setter: setGoalProtein},
        {name: "Carbs", currentProgress: currentCarbs, goal: goalCarbs, setter: setGoalCarbs},
        {name: "Fats", currentProgress: currentFats, goal: goalFats, setter: setGoalFats}
    ]


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