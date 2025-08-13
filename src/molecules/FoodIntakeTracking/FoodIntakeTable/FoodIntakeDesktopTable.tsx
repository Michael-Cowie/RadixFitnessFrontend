import React from 'react';

import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { TableProps } from './FoodIntakeinterfaces';
import { formatNumberToDisplayPrecision } from 'lib/display';
import { IconButton, Typography } from '@mui/material';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import { caloriesLabel, carbsLabel, fatsLabel, proteinLabel } from './FoodIntakeUtils';

const numberOfFoodColumns = 4;

const rowHeight = '48px';
const labelWidthPercentage = 35;
const trashCanWidth = 10;
const foodWidthPercentage = (100 - labelWidthPercentage - trashCanWidth) / numberOfFoodColumns;

const labelCellStyle = {
  width: `${labelWidthPercentage}%`,
  height: rowHeight,
  padding: '8px',
};

const foodCellStyle = {
  width: `${foodWidthPercentage}%`,
  height: rowHeight,
};

const FoodIntakeDesktopTable: React.FC<TableProps> = ({ entries, foodMassUnit }) => {
  const { deleteFoodEntryWithID } = useFoodIntakeTrackingContext();

  return (
    <>
      <TableContainer className="h-full">
        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow sx={{ height: rowHeight }}>
              <TableCell align="left" sx={labelCellStyle} />
              <TableCell align="right" sx={foodCellStyle}>
                {caloriesLabel}
              </TableCell>
              <TableCell align="right" sx={foodCellStyle}>
                {proteinLabel}
              </TableCell>
              <TableCell align="right" sx={foodCellStyle}>
                {fatsLabel}
              </TableCell>
              <TableCell align="right" sx={foodCellStyle}>
                {carbsLabel}
              </TableCell>
              <TableCell align="right" sx={{ width: `${trashCanWidth}%` }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {entries.map((row) => (
              <TableRow key={row.id} sx={{ height: rowHeight }}>
                <TableCell align="left">
                  <Typography
                    sx={{
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {row.foodName}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {`${formatNumberToDisplayPrecision(row.totalCalories)} kcal`}
                </TableCell>
                <TableCell align="right">{`${formatNumberToDisplayPrecision(row.totalProtein)} ${foodMassUnit}`}</TableCell>
                <TableCell align="right">{`${formatNumberToDisplayPrecision(row.totalFats)} ${foodMassUnit}`}</TableCell>
                <TableCell align="right">{`${formatNumberToDisplayPrecision(row.totalCarbs)} ${foodMassUnit}`}</TableCell>

                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      deleteFoodEntryWithID(row.id);
                    }}
                  >
                    <DeleteSharpIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FoodIntakeDesktopTable;
