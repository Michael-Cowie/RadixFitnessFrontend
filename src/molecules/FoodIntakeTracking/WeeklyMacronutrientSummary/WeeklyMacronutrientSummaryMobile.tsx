import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';

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
  const cards = Object.entries(summary.summary).map(([nutrient, data]) => {
    const unit = nutrient === 'Calories' ? 'kcal' : foodMassUnit;

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
                {nutrient}
              </Typography>
            </div>

            <div className="ml-1">
              <StatRow label="Total Logged:" value={`${data.totalConsumed.toFixed(0)} ${unit}`} />
              <StatRow label="Goal Total:" value={`${data.totalGoal.toFixed(0)} ${unit}`} />
              <StatRow label="Progress:" value={`${data.percentageOfGoal.toFixed(0)}%`} />
              <StatRow label="Average:" value={`${data.averageConsumed.toFixed(0)} ${unit}`} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  });

  return (
    <>
      <div className="flex justify-center">
        <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
          {`Weekly Summary - ${summary.daysWithLogs} Days Logged`}
        </Typography>
      </div>
      {cards}
    </>
  );
};

export default WeeklyMacroNutrientSummaryMobile;
