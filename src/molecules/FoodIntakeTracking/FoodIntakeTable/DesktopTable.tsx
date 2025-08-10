import React from 'react';

import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { TableProps } from './interfaces';
import { formatToDisplayPrecision } from 'lib/display';
import { IconButton, Typography } from '@mui/material';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';

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

const DesktopTable: React.FC<TableProps> = ({ entries }) => {
  const { deleteFoodEntryWithID } = useFoodIntakeTrackingContext();

  return (
    <>
      <TableContainer className="h-full">
        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow sx={{ height: rowHeight }}>
              <TableCell align="left" sx={labelCellStyle} />
              <TableCell align="right" sx={foodCellStyle}>
                Calories
              </TableCell>
              <TableCell align="right" sx={foodCellStyle}>
                Fat (g)
              </TableCell>
              <TableCell align="right" sx={foodCellStyle}>
                Carbs (g)
              </TableCell>
              <TableCell align="right" sx={foodCellStyle}>
                Protein (g)
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
                <TableCell align="right">{formatToDisplayPrecision(row.totalCalories)}</TableCell>
                <TableCell align="right">{formatToDisplayPrecision(row.totalFats)}</TableCell>
                <TableCell align="right">{formatToDisplayPrecision(row.totalCarbs)}</TableCell>
                <TableCell align="right">{formatToDisplayPrecision(row.totalProtein)}</TableCell>

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

export default DesktopTable;
