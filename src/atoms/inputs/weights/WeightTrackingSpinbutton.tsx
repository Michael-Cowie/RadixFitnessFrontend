import TextField from '@mui/material/TextField';
import { FormEvent } from 'react';
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
        value={Number.isNaN(value) ? '' : value.toFixed(2)}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);

          if (!isNaN(newValue)) {
            onChange(newValue);
          }
        }}
        onInput={(e: FormEvent<HTMLInputElement>) => validateInput(e)}
      />
    </div>
  );
};

export default WeightTrackingSpinbutton;
