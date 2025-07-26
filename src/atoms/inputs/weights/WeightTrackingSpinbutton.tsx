import TextField from '@mui/material/TextField';
import { useEffect, useState, FormEvent } from 'react';
import styles from './spinbutton.module.css';
import { validateInput } from './WeightTrackingSpinbuttonAlgorithms';

interface Props {
  value: number;
  onChange: (val: number) => void;
  displayUnit: string;
  name: string;
  label: string;
  disabled?: boolean;
}

const WeightTrackingSpinbutton: React.FC<Props> = ({
  value,
  onChange,
  displayUnit,
  name,
  label,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value.toFixed(2));

  useEffect(() => {
    setInputValue(value.toFixed(2));
  }, [value]);

  return (
    <div className={`w-full mt-3 ${styles.weightUnitWrapper} ${styles[displayUnit]}`}>
      <TextField
        disabled={disabled}
        name={name}
        label={label}
        type="number"
        className="w-full"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 0.01, min: 10, max: 1000 }}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onBlur={() => {
          const parsed = parseFloat(inputValue);
          setInputValue(parsed.toFixed(2));
          onChange(parsed);
        }}
        onInput={(e: FormEvent<HTMLInputElement>) => validateInput(e)}
      />
    </div>
  );
};

export default WeightTrackingSpinbutton;
