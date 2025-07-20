import React from 'react';

import { Card, CardContent, Typography } from '@mui/material';

import { TableProps } from './interfaces';

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

const MobileTable: React.FC<TableProps> = ({ entries, handleContextMenu }) => {
  const numberOfColumns = 2;
  const rows = [];

  for (let i = 0; i < entries.length; i += numberOfColumns) {
    const columns = entries.slice(i, i + numberOfColumns);

    rows.push(
      <div className="flex flex-col justify-between items-center">
        {columns.map((column) => (
          <Card
            key={column.id}
            sx={{
              margin: 2,
              border: '1px solid',
              borderColor: 'var(--darkBlue)',
              width: '80%',
            }}
            onContextMenu={(e) => handleContextMenu(e, column.id, column.foodName)}
          >
            <CardContent>
              <div className="flex justify-center">
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={column.foodName}
                >
                  {column.foodName}
                </Typography>
              </div>

              <div className="ml-1">
                <FoodCell label="Calories:" amount={`${column.totalCalories}`} />
                <FoodCell label="Protein:" amount={`${column.totalProtein} g`} />
                <FoodCell label="Fats:" amount={`${column.totalFats} g`} />
                <FoodCell label="Carbs:" amount={`${column.totalCarbs} g`} />
                <FoodCell
                  label="Weight:"
                  amount={column.foodWeight > 0 ? `${column.foodWeight} g` : '-'}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>,
    );
  }

  return <>{rows}</>;
};

export default MobileTable;
