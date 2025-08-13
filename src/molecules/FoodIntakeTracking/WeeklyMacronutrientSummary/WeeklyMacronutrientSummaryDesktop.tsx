import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import React from 'react';
import { MacronutrientAnalyticsSummary } from 'services/Analytics/analyticsServiceInterfaces';
import {
  averageHeaderTitle,
  formatNutrientNameForDisplay,
  goalTotalHeaderTitle,
  progressHeaderTitle,
  totalLoggedHeaderTitle,
} from './WeeklyMacronutrientSummaryUtils';
import { SummaryTitle } from './WeeklyMacronutrientSummarySharedComponents';
import { formatNumberToDisplayPrecision, getEnergyUnit } from 'lib/display';

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
    <>
      <SummaryTitle numberOfDaysWithLogs={summary.daysWithLogs} />

      <TableContainer sx={{ boxShadow: 'none' }} className="w-full">
        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={CellStyle}></TableCell>
              <TableCell sx={CellStyle} align="right">
                {totalLoggedHeaderTitle}
              </TableCell>
              <TableCell sx={CellStyle} align="right">
                {goalTotalHeaderTitle}
              </TableCell>
              <TableCell sx={CellStyle} align="right">
                {progressHeaderTitle}
              </TableCell>
              <TableCell sx={CellStyle} align="right">
                {averageHeaderTitle}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(summary.summary).map(([nutrient, data]) => {
              return (
                <TableRow key={nutrient} sx={CellStyle}>
                  <TableCell>{formatNutrientNameForDisplay(nutrient)}</TableCell>
                  <TableCell align="right">
                    {formatNumberToDisplayPrecision(data.totalConsumed)} {getEnergyUnit()}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumberToDisplayPrecision(data.totalGoal)} {foodMassUnit}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumberToDisplayPrecision(data.percentageOfGoal)}%
                  </TableCell>
                  <TableCell align="right">
                    {formatNumberToDisplayPrecision(data.averageConsumed)} {foodMassUnit}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default WeeklyMacroNutrientSummaryDesktop;
