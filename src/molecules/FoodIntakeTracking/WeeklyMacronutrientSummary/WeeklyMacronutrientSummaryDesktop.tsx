import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import React from 'react';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';

type Props = {
  summary: MacronutrientAnalyticsSummary;
  foodMassUnit: AvailableFoodWeightUnits;
};

const CellStyle = {
  height: '48px',
  padding: '8px',
} as const;

const WeeklyMacroNutrientSummaryDesktop: React.FC<Props> = ({ summary, foodMassUnit }) => {
  return (
    <TableContainer sx={{ boxShadow: 'none' }} className="w-full">
      <Typography className="text-center" sx={{ fontWeight: 'bold' }}>
        {`Weekly Summary - ${summary.daysWithLogs} Day${summary.daysWithLogs > 1 ? 's' : ''} Logged`}
      </Typography>

      <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={CellStyle}></TableCell>
            <TableCell sx={CellStyle} align="right">
              Total Logged
            </TableCell>
            <TableCell sx={CellStyle} align="right">
              Goal Total
            </TableCell>
            <TableCell sx={CellStyle} align="right">
              Progress
            </TableCell>
            <TableCell sx={CellStyle} align="right">
              Average
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.entries(summary.summary).map(([nutrient, data]) => {
            const unit = nutrient === 'Calories' ? 'kcal' : foodMassUnit;

            return (
              <TableRow key={nutrient} sx={CellStyle}>
                <TableCell>{nutrient}</TableCell>
                <TableCell align="right">
                  {data.totalConsumed.toFixed(0)} {unit}
                </TableCell>
                <TableCell align="right">
                  {data.totalGoal.toFixed(0)} {unit}
                </TableCell>
                <TableCell align="right">{data.percentageOfGoal.toFixed(0)}%</TableCell>
                <TableCell align="right">
                  {data.averageConsumed.toFixed(0)} {unit}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeeklyMacroNutrientSummaryDesktop;
