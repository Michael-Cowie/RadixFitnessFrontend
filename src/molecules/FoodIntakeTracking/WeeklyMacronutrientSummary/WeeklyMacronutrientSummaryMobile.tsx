import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';
import {
  averageHeaderTitle,
  formatNutrientNameForDisplay,
  goalTotalHeaderTitle,
  progressHeaderTitle,
  totalLoggedHeaderTitle,
} from './WeeklyMacronutrientSummaryUtils';
import { SummaryTitle } from './WeeklyMacronutrientSummarySharedComponents';
import { borderThickness, formatNumberToDisplayPrecision, getEnergyUnit } from 'lib/display';

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
                border: `${borderThickness} solid`,
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
                    label={`${totalLoggedHeaderTitle}`}
                    value={`${formatNumberToDisplayPrecision(data.totalConsumed)} ${getEnergyUnit()}`}
                  />
                  <StatRow
                    label={`${goalTotalHeaderTitle}`}
                    value={`${formatNumberToDisplayPrecision(data.totalGoal)} ${foodMassUnit}`}
                  />
                  <StatRow
                    label={`${progressHeaderTitle}`}
                    value={`${formatNumberToDisplayPrecision(data.percentageOfGoal)}%`}
                  />
                  <StatRow
                    label={`${averageHeaderTitle}`}
                    value={`${formatNumberToDisplayPrecision(data.averageConsumed)} ${foodMassUnit}`}
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
