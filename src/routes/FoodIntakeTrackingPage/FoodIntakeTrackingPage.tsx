import { FoodIntakeTrackingContextComponent } from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import PageTemplate from 'templates/PageTemplate';
import DateSelection from 'molecules/FoodIntakeTracking/DateSelection';
import DailyMacroNutrientProgress from 'molecules/FoodIntakeTracking/DailyMacroNutrientProgress/DailyMacroNutrientProgress';
import FoodIntakeTable from 'molecules/FoodIntakeTracking/FoodIntakeTable/FoodIntakeTable';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import WeeklyMacroNutrientSummaryDesktop from 'molecules/FoodIntakeTracking/WeeklyMacronutrientSummary/WeeklyMacronutrientSummaryDesktop';
import { isWeeklySummaryView } from 'context/FoodIntakeTracking/FoodIntakeTrackingUtils';
import WeeklyMacroNutrientSummaryMobile from 'molecules/FoodIntakeTracking/WeeklyMacronutrientSummary/WeeklyMacronutrientSummaryMobile';
import useProfileContext from 'context/ProfileContext/hooks';
import { useEffect, useState } from 'react';
import { userMeasureSystemToFoodUnit } from 'lib/foodTranslations';
import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';

import * as Sentry from '@sentry/react';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';
import { Typography } from '@mui/material';

const mainContentWidth = 'w-10/12 sm:w-10/12 md:w-8/12 lg:w-8/12 xl:w-7/12 2xl:w-5/12';
const tableContentWidth = 'w-10/12 sm:w-10/12 md:w-8/12 lg:w-8/12 xl:w-7/12 h-[50%]';

const PageContent = () => {
  const { selectedView, weekStart, getMacronutrientWeeklySummary, isLoading } =
    useFoodIntakeTrackingContext();
  const { measurementSystem } = useProfileContext();
  const [summary, setSummary] = useState<MacronutrientAnalyticsSummary | null>(null);
  const foodMassUnit = userMeasureSystemToFoodUnit(measurementSystem);

  useEffect(() => {
    getMacronutrientWeeklySummary(weekStart).then(setSummary).catch(Sentry.captureException);
  }, [selectedView.type, weekStart, getMacronutrientWeeklySummary]);

  if (isLoading || !summary) {
    return (
      <div className="flex h-full justify-center items-center w-1/3">
        <SubmitButtonWithProgress buttonText="Loading" displayLoadingAnimation />
      </div>
    );
  }

  if (isWeeklySummaryView(selectedView)) {
    if (summary.daysWithLogs === 0) {
      return (
        <div className={`${mainContentWidth} mt-3 sm:mt-0 flex flex-col items-center`}>
          <DateSelection />
          <div className="flex flex-col items-center justify-center mt-8 p-6 border-2 border-dashed rounded-lg border-gray-300 w-full text-center">
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              No entries found for this period
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Start logging your meals to see your macronutrient summary here.
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <div className={`${mainContentWidth} mt-3 sm:mt-0`}>
        <DateSelection />
        <div className="block sm:hidden">
          <WeeklyMacroNutrientSummaryMobile summary={summary} foodMassUnit={foodMassUnit} />
        </div>
        <div className="hidden sm:block">
          <WeeklyMacroNutrientSummaryDesktop summary={summary} foodMassUnit={foodMassUnit} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${mainContentWidth} mt-3 sm:mt-0`}>
        <DateSelection />
        <DailyMacroNutrientProgress />
      </div>
      <div className={tableContentWidth}>
        <FoodIntakeTable />
      </div>
    </>
  );
};

const FoodIntakeTrackingPage = () => (
  <PageTemplate>
    <FoodIntakeTrackingContextComponent>
      <PageContent />
    </FoodIntakeTrackingContextComponent>
  </PageTemplate>
);

export default FoodIntakeTrackingPage;
