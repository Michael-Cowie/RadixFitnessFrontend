import { TextField } from '@mui/material';

export interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

export const InputWithLabel: React.FC<Props> = ({
  label,
  name,
  type = 'text',
  placeholder = 'Type here',
}) => {
  return (
    <TextField
      InputProps={{
        className: 'mb-5 mt-5',
      }}
      name={name}
      variant="standard"
      label={label}
      placeholder={placeholder}
      type={type}
      fullWidth
    />
  );
};
