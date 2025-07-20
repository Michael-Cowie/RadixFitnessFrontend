import styles from 'atoms/inputs/weights/spinbutton.module.css';
import { useState } from 'react';

import TextField from '@mui/material/TextField';

export type AvailableUnits = 'g' | 'kg' | 'lbs' | false;

interface NumberedTextFieldWithRangeProps {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  label: string;
  setterCallback: (newValue: number) => void;
  units?: AvailableUnits;
}

const NumberedTextFieldWithRange: React.FC<NumberedTextFieldWithRangeProps> = ({
  min,
  max,
  step,
  defaultValue,
  label,
  setterCallback,
  units = false,
}) => {
  const [inputValue, setInputValue] = useState<string | number>(defaultValue);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue: number = Number(e.target.value);

    if (e.target.value === '') {
      setInputValue('');
    } else if (newValue < min) {
      setInputValue(min);
      setterCallback(min);
    } else if (newValue > max) {
      setInputValue(max);
      setterCallback(max);
    } else {
      setInputValue(newValue);
      setterCallback(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission, useful for modal windows
      handleBlur(e as unknown as React.FocusEvent<HTMLInputElement>);

      const textField = document.getElementById(`${label}_textfield`) as HTMLInputElement;
      textField.blur(); // Lose focus
      return false;
    }
  };

  return (
    <>
      <div className={`w-56 ${styles.weightUnitWrapper} ${units ? styles[units] : ''}`}>
        <TextField
          id={`${label}_textfield`}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          label={label}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          className="w-full"
          inputProps={{
            step: step,
            min: min,
            max: max,
          }}
        />
      </div>
    </>
  );
};

export default NumberedTextFieldWithRange;
