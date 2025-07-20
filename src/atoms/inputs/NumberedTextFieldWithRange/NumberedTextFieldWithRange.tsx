import styles from 'atoms/inputs/weights/spinbutton.module.css';
import TextField from '@mui/material/TextField';
import InformationHover from 'atoms/InformationHover';

export type AvailableUnits = 'g' | 'kg' | 'lbs' | false;

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
  value,
  label,
  setterCallback,
  units = false,
  disabled = false,
  informationText = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setterCallback(newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (e.target.value === '') return;

    const boundedValue = Math.max(min, Math.min(newValue, max));
    setterCallback(boundedValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textField = document.getElementById(`${label}_textfield`) as HTMLInputElement;
      textField?.blur(); // trigger blur validation
    }
  };

  return (
    <div className={`w-56 ${styles.weightUnitWrapper} ${units ? styles[units] : ''}`}>
      <TextField
        id={`${label}_textfield`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        label={
          <div className="flex items-center gap-1">
            {label}
            {informationText && <InformationHover information={informationText} />}
          </div>
        }
        type="number"
        InputLabelProps={{ shrink: true }}
        className="w-full"
        inputProps={{ step, min, max }}
        disabled={disabled}
      />
    </div>
  );
};

export default NumberedTextFieldUnitAndInformation;
