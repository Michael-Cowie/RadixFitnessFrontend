import { AvailableFoodWeightUnits } from 'lib/foodTranslations';

export const formatSummaryTitle = (numberOfDaysWithLogs: number) => {
  return `Weekly Summary - ${numberOfDaysWithLogs} Day${numberOfDaysWithLogs > 1 ? 's' : ''} Logged`;
};

export const formatNutrientNameForDisplay = (nutrientName: string) => {
  return nutrientName.charAt(0).toUpperCase() + nutrientName.slice(1);
};

export const formatNumberForDisplay = (inputNumber: number) => {
  return inputNumber.toFixed(0);
};

export const formatUnit = (nutrient: string, foodMassUnit: AvailableFoodWeightUnits) => {
  return nutrient === 'calories' ? 'kcal' : foodMassUnit;
};

export const getTotalLoggedHeaderTitle = () => {
  return 'Total Logged';
};

export const getGoalTotalHeaderTitle = () => {
  return 'Goal Total';
};

export const getProgressHeaderTitle = () => {
  return 'Progress';
};

export const getAverageHeaderTitle = () => {
  return 'Average';
};
