import styled from 'styled-components';
import { TextField } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';

interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  register: UseFormRegister<any>;
  error?: string;
}

export const ValidatedInputWithLabel: React.FC<Props> = ({
  label,
  name,
  type = "text",
  placeholder = "Type Here",
  register,
  error
}) => {
  return (
    <Container>
      <TextField
        {...register(name)}
        variant="standard"
        className="border-2 w-full"
        label={label}
        name={name}
        type={type}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
