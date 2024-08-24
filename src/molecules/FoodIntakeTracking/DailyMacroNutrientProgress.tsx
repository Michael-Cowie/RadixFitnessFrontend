import ProgressBarWithCenteredText from 'atoms/ProgressBarWithCenteredText';
import React from 'react';

import { MacroNutrientRowProps } from './DailyMacroNutrientInterfaces';

const trackedMacroNutrients = ["Calories", "Protein", "Carbs", "Fats"];

const dailyRecommendedIntake: Record<string, number> = {
    Calories: 2000,
    Protein: 50,
    Carbs: 275,
    Fats: 70
};

const MacroNutrientRow: React.FC<MacroNutrientRowProps> = ({ nutrientName, currentValue = 0, maxValue }) => {
    return (
        <div className='flex flex-row w-full p-1'>
            <div className='w-20 font-bold'>
                { nutrientName }
            </div>
            <ProgressBarWithCenteredText value={currentValue} initialGoalValue={maxValue}/>
        </div>
    )
}

const DailyMacroNutrientProgress = () => {
    const rowComponents = trackedMacroNutrients.map((macroNutrientName, i) => {
        return (
            <MacroNutrientRow
                key={ i }
                nutrientName={ macroNutrientName }
                currentValue={ 0 }
                maxValue={ dailyRecommendedIntake[macroNutrientName] }
            />
        );
    });

    return (
        <div className='flex flex-col'>
            { rowComponents }
        </div>
    )
}


export default DailyMacroNutrientProgress;