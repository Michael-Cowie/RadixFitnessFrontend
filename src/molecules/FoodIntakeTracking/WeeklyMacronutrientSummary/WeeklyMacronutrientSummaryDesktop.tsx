import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AvailableFoodWeightUnits } from 'lib/foodTranslations';
import React from 'react';
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
                {getTotalLoggedHeaderTitle()}
              </TableCell>
              <TableCell sx={CellStyle} align="right">
                {getGoalTotalHeaderTitle()}
              </TableCell>
              <TableCell sx={CellStyle} align="right">
                {getProgressHeaderTitle()}
              </TableCell>
              <TableCell sx={CellStyle} align="right">
                {getAverageHeaderTitle()}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(summary.summary).map(([nutrient, data]) => {
              return (
                <TableRow key={nutrient} sx={CellStyle}>
                  <TableCell>{formatNutrientNameForDisplay(nutrient)}</TableCell>
                  <TableCell align="right">
                    {formatNumberForDisplay(data.totalConsumed)}{' '}
                    {formatUnit(nutrient, foodMassUnit)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumberForDisplay(data.totalGoal)} {formatUnit(nutrient, foodMassUnit)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumberForDisplay(data.percentageOfGoal)}%
                  </TableCell>
                  <TableCell align="right">
                    {formatNumberForDisplay(data.averageConsumed)}{' '}
                    {formatUnit(nutrient, foodMassUnit)}
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
