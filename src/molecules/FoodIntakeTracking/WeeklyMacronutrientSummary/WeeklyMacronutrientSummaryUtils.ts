export const formatSummaryTitle = (numberOfDaysWithLogs: number) => {
  return `Weekly Summary - ${numberOfDaysWithLogs} Day${numberOfDaysWithLogs > 1 ? 's' : ''} Logged`;
};

export const formatNutrientNameForDisplay = (nutrientName: string) => {
  return nutrientName.charAt(0).toUpperCase() + nutrientName.slice(1);
};

export const totalLoggedHeaderTitle = 'Total Logged';
export const goalTotalHeaderTitle = 'Goal Total';
export const progressHeaderTitle = 'Progress';
export const averageHeaderTitle = 'Average';
