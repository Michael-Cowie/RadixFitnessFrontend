import React, { useState } from 'react';

import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

interface CustomLinearProgressProps {
  value: number;
  initialGoalValue: number;
  onChange: (value: number) => void;
}

const FONT_FAMILY = '"Roboto", "Helvetica", "Arial", sans-serif';

const ProgressBarWithCenteredText: React.FC<CustomLinearProgressProps> = ({
  value,
  initialGoalValue,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goalValue, setGoalValue] = useState(initialGoalValue);

  const progress = value / goalValue >= 1 ? 100 : (value / goalValue) * 100;

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue: number = Number(e.target.value);

    if (newValue >= 0 && newValue <= 5000) {
      setGoalValue(newValue);
      onChange(newValue);
    } else if (newValue < 0) {
      setGoalValue(0);
      onChange(0);
    } else {
      setGoalValue(5000);
      onChange(5000);
    }

    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur(e as unknown as React.FocusEvent<HTMLInputElement>);
    }
  };

  const goalDisplay = isEditing ? (
    <TextField
      autoFocus
      defaultValue={goalValue}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      type="number"
      size="small"
      sx={{
        height: '100%',
        width: 'calc(100% + 10px)',
        transform: 'translateX(-10px)',
        input: {
          height: '100%',
          paddingLeft: '10px',
          fontWeight: 700,
        },
      }}
      InputProps={{ inputProps: { min: 0, max: 5000 } }}
    />
  ) : (
    <div className="flex items-center cursor-pointer" onDoubleClick={handleDoubleClick}>
      <span className="flex-1">{goalValue}</span>
      <CreateRoundedIcon sx={{ fontSize: 16, marginRight: '10px' }} />
    </div>
  );

  return (
    <Box
      position="relative"
      width="100%"
      sx={{ userSelect: 'none', fontFamily: FONT_FAMILY, height: 30 }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        style={{ width: '100%', height: '100%', borderRadius: 20 }}
      />

      <Box className="absolute inset-0 flex items-center justify-center font-bold">
        <Box className="flex-1 text-right">{value}</Box>

        <Box className="w-8 text-center">/</Box>

        <Box className="flex-1">{goalDisplay}</Box>
      </Box>
    </Box>
  );
};

export default ProgressBarWithCenteredText;
