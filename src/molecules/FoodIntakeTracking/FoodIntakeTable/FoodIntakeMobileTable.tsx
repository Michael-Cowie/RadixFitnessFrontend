import React from 'react';

import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import { Card, CardContent, IconButton, Typography } from '@mui/material';

import { TableProps } from './FoodIntakeinterfaces';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import { borderThickness, formatNumberToDisplayPrecision, getEnergyUnit } from 'lib/display';
import { caloriesLabel, carbsLabel, fatsLabel, proteinLabel } from './FoodIntakeUtils';

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

const FoodIntakeMobileTable: React.FC<TableProps> = ({ entries, foodMassUnit }) => {
  const { deleteFoodEntryWithID } = useFoodIntakeTrackingContext();

  const rows = [];

  for (const entry of entries) {
    rows.push(
      <div key={entry.id} className="flex flex-col justify-between items-center">
        <Card
          sx={{
            margin: 2,
            border: `${borderThickness} solid`,
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
                label={caloriesLabel}
                amount={`${formatNumberToDisplayPrecision(entry.totalCalories)} ${getEnergyUnit()}`}
              />
              <FoodCell
                label={proteinLabel}
                amount={`${formatNumberToDisplayPrecision(entry.totalProtein)} ${foodMassUnit}`}
              />
              <FoodCell
                label={fatsLabel}
                amount={`${formatNumberToDisplayPrecision(entry.totalFats)} ${foodMassUnit}`}
              />
              <FoodCell
                label={carbsLabel}
                amount={`${formatNumberToDisplayPrecision(entry.totalCarbs)} ${foodMassUnit}`}
              />
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

export default FoodIntakeMobileTable;
