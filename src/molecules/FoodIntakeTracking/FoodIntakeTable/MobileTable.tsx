import React from 'react';

import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import { Card, CardContent, IconButton, Typography } from '@mui/material';

import { TableProps } from './interfaces';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import { formatToDisplayPrecision } from 'lib/display';

interface FoodCellProps {
  label: string;
  amount: string;
}

const FoodCell: React.FC<FoodCellProps> = ({ label, amount }) => {
  return (
    <>
      <div className="flex flex-row">
        <Typography sx={{ fontWeight: 'bold', width: '110px' }}> {label} </Typography>
        <Typography> {amount} </Typography>
      </div>
    </>
  );
};

const MobileTable: React.FC<TableProps> = ({ entries }) => {
  const { deleteFoodEntryWithID } = useFoodIntakeTrackingContext();

  const rows = [];

  for (const entry of entries) {
    rows.push(
      <div key={entry.id} className="flex flex-col justify-between items-center">
        <Card
          sx={{
            margin: 2,
            border: '1px solid',
            borderColor: 'var(--darkBlue)',
            width: '80%',
          }}
        >
          <CardContent sx={{ pt: 1, pl: 1, pr: 1, pb: '0 !important' }}>
            <div className="flex justify-center">
              <Typography
                sx={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {entry.foodName}
              </Typography>
            </div>

            <div className="ml-1">
              <FoodCell
                label="Calories:"
                amount={`${formatToDisplayPrecision(entry.totalCalories)}`}
              />
              <FoodCell
                label="Protein:"
                amount={`${formatToDisplayPrecision(entry.totalProtein)} g`}
              />
              <FoodCell label="Fats:" amount={`${formatToDisplayPrecision(entry.totalFats)} g`} />
              <FoodCell label="Carbs:" amount={`${formatToDisplayPrecision(entry.totalCarbs)} g`} />
            </div>
            <div className="flex justify-end">
              <IconButton
                onClick={() => {
                  deleteFoodEntryWithID(entry.id);
                }}
              >
                <DeleteSharpIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      </div>,
    );
  }
  return <>{rows}</>;
};

export default MobileTable;
