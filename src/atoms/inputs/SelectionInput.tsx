import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
  name: string;
  label: string;
  options: readonly string[];
  defaultIndex?: number;
}

const SelectionInput: React.FC<Props> = ({ name, label, options, defaultIndex = 0 }) => {
  const { control } = useFormContext();

  return (
    <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={options[defaultIndex]}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${name}-label`}
            id={`${name}-select`}
            label={label}
            value={field.value || options[defaultIndex]}
            onChange={(e: SelectChangeEvent<string>) => {
              field.onChange(e.target.value);
            }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default SelectionInput;
