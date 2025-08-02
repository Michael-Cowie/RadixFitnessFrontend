import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InformationHover from 'atoms/InformationHover';
import { InputAdornment } from '@mui/material';

export type AvailableUnits = 'g' | 'kg' | 'lbs';

interface NumberedTextFieldWithRangeProps {
  min: number;
  max: number;
  step: number;
  value: number;
  label: string;
  setterCallback: (newValue: number) => void;
  units?: AvailableUnits;
  disabled?: boolean;
  informationText?: string;
}

const NumberedTextFieldUnitAndInformation: React.FC<NumberedTextFieldWithRangeProps> = ({
  min,
  max,
  step,
  value: defaultValue,
  label,
  setterCallback,
  units = '',
  disabled = false,
  informationText = '',
}) => {
  const [inputValue, setInputValue] = useState(defaultValue.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const userInputValue = Number(inputValue);

    if (isNaN(userInputValue)) {
      setInputValue(defaultValue.toString());
    } else {
      const bounded = Math.max(min, Math.min(userInputValue, max));
      setterCallback(bounded);
      setInputValue(bounded.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
  };

  return (
    <div className={`w-56 ${units ? units : ''}`}>
      <TextField
        id={`${label}_textfield`}
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        label={
          <div className="flex items-center gap-1">
            {label}
            {informationText && <InformationHover information={informationText} />}
          </div>
        }
        InputLabelProps={{ shrink: true }}
        className="w-full"
        inputProps={{ inputMode: 'decimal', step, min, max }}
        InputProps={{
          endAdornment: <InputAdornment position="end">{units}</InputAdornment>,
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default NumberedTextFieldUnitAndInformation;
