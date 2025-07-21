import React from 'react';

import Paper from '@mui/material/Paper/Paper';
import Table from '@mui/material/Table/Table';
import TableBody from '@mui/material/TableBody/TableBody';
import TableCell from '@mui/material/TableCell/TableCell';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from '@mui/material/TableRow/TableRow';

import { EmptyCellsProps, pageSize, TableProps } from './interfaces';

const expectedColumnNumber = 5;
const numberOfFoodColumns = 4;

const rowHeight = '48px';
const labelWidthPercentage = 25;
const foodWidthPercentage = (100 - 25) / numberOfFoodColumns;

const labelCellStyle = {
  width: `${labelWidthPercentage}%`,
  height: rowHeight,
  padding: '8px',
};

const foodCellStyle = {
  width: `${foodWidthPercentage}%`,
  height: rowHeight,
};

const EmptyRows: React.FC<EmptyCellsProps> = ({ amount }) => {
  return (
    <>
      {Array.from({ length: amount }).map((_, index) => (
        <TableRow key={index} sx={{ height: rowHeight }}>
          {Array.from({ length: expectedColumnNumber }).map((_, index) => (
            <TableCell key={index} />
          ))}
        </TableRow>
      ))}
    </>
  );
};

const DesktopTable: React.FC<TableProps> = ({ entries, handleContextMenu }) => {
  return (
    <>
      <TableContainer component={Paper}>
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
            </TableRow>
          </TableHead>

          <TableBody>
            {entries.map((row) => (
              <TableRow
                key={row.id}
                onContextMenu={(e) => handleContextMenu(e, row.id, row.foodName)}
                sx={{ height: rowHeight }}
              >
                <TableCell align="left">{row.foodName}</TableCell>
                <TableCell align="right">{row.totalCalories}</TableCell>
                <TableCell align="right">{row.totalFats}</TableCell>
                <TableCell align="right">{row.totalCarbs}</TableCell>
                <TableCell align="right">{row.totalProtein}</TableCell>
              </TableRow>
            ))}

            <EmptyRows amount={pageSize - entries.length} />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DesktopTable;
