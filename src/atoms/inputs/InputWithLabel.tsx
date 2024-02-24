import styled from 'styled-components';

import { TextField } from '@mui/material';

export interface Props {
  label: string,
  name: string,
  type?: string,
  placeholder?: string
}

export const InputWithLabel: React.FC<Props> = ({ label, name, type="text", placeholder="Type here" }) => {
  return (
    <Container>
      <TextField 
        name={ name} 
        variant="standard" 
        label={ label }
        placeholder={ placeholder }
        type={ type }
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
`
