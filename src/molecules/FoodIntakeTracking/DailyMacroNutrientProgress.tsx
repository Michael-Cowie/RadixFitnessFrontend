import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
import ProgressBarWithCenteredText from 'atoms/ProgressBarWithCenteredText';
import React from 'react';

import { MacroNutrientRowProps } from './DailyMacroNutrientInterfaces';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import { Group, GroupContainer } from 'atoms/design_patterns/Group';

const MacroNutrientRow: React.FC<MacroNutrientRowProps> = ({
  nutrientName,
  currentValue,
  maxValue,
  goalSetter,
}) => {
  return (
    <>
      {/* Mobile layout */}
      <div className="block sm:hidden w-full">
        <GroupContainer>
          <Group title={nutrientName}>
            <ProgressBarWithCenteredText
              value={currentValue}
              initialGoalValue={maxValue}
              onChange={goalSetter}
            />
          </Group>
        </GroupContainer>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex flex-row w-full p-1">
        <div className="w-20 font-bold">{nutrientName}</div>
        <ProgressBarWithCenteredText
          value={currentValue}
          initialGoalValue={maxValue}
          onChange={goalSetter}
        />
      </div>
    </>
  );
};

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
  } = useFoodIntakeTrackingContext();

  let currentCalories = 0;
  let currentProtein = 0;
  let currentCarbs = 0;
  let currentFats = 0;

  for (const foodEntry of foodEntries) {
    currentCalories += foodEntry.totalCalories;
    currentProtein += foodEntry.totalProtein;
    currentCarbs += foodEntry.totalCarbs;
    currentFats += foodEntry.totalFats;
  }

  const allGoalMacronutrientGoals = [
    {
      name: 'Calories',
      currentProgress: currentCalories,
      goal: goalCalories,
      setter: setGoalCalories,
    },
    { name: 'Protein', currentProgress: currentProtein, goal: goalProtein, setter: setGoalProtein },
    { name: 'Carbs', currentProgress: currentCarbs, goal: goalCarbs, setter: setGoalCarbs },
    { name: 'Fats', currentProgress: currentFats, goal: goalFats, setter: setGoalFats },
  ];

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <SubmitButtonWithProgress buttonText="Loading" displayLoadingAnimation={true} />
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
  );
};

export default DailyMacroNutrientProgress;
