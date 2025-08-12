import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';
import {
  formatNumberForDisplay,
  formatNutrientNameForDisplay,
  formatUnit,
  getAverageHeaderTitle,
  getGoalTotalHeaderTitle,
  getProgressHeaderTitle,
  getTotalLoggedHeaderTitle,
} from './WeeklyMacronutrientSummaryUtils';
import { SummaryTitle } from './WeeklyMacronutrientSummarySharedComponents';

interface Props {
  summary: MacronutrientAnalyticsSummary;
  foodMassUnit: AvailableFoodWeightUnits;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row">
      <Typography sx={{ fontWeight: 'bold', width: '130px' }}>{label}</Typography>
      <Typography>{value}</Typography>
    </div>
  );
}

const WeeklyMacroNutrientSummaryMobile: React.FC<Props> = ({ summary, foodMassUnit }) => {
  return (
    <>
      <SummaryTitle numberOfDaysWithLogs={summary.daysWithLogs} />

      {Object.entries(summary.summary).map(([nutrient, data]) => {
        return (
          <div key={nutrient} className="flex flex-col justify-between items-center">
            <Card
              sx={{
                margin: 1,
                border: '2px solid',
                borderColor: 'var(--darkBlue)',
                width: '80%',
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <div className="flex justify-center">
                  <Typography
                    sx={{
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatNutrientNameForDisplay(nutrient)}
                  </Typography>
                </div>

                <div className="ml-1">
                  <StatRow
                    label={`${getTotalLoggedHeaderTitle()}`}
                    value={`${formatNumberForDisplay(data.totalConsumed)} ${formatUnit(nutrient, foodMassUnit)}`}
                  />
                  <StatRow
                    label={`${getGoalTotalHeaderTitle()}`}
                    value={`${formatNumberForDisplay(data.totalGoal)} ${formatUnit(nutrient, foodMassUnit)}`}
                  />
                  <StatRow
                    label={`${getProgressHeaderTitle()}`}
                    value={`${formatNumberForDisplay(data.percentageOfGoal)}%`}
                  />
                  <StatRow
                    label={`${getAverageHeaderTitle()}`}
                    value={`${formatNumberForDisplay(data.averageConsumed)} ${formatUnit(nutrient, foodMassUnit)}`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default WeeklyMacroNutrientSummaryMobile;
