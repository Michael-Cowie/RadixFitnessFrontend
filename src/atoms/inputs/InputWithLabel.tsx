import styled from 'styled-components';

import { Label } from './shared';

export interface Props {
  label: string,
  name: string,
  type?: string,
  placeholder?: string
}

export const InputWithLabel: React.FC<Props> = ({ label, name, type="text", placeholder="Type here" }) => {
  return (
    <Container>
      <Label> { label } </Label>

      <input
        className="border-2 input input-bordered"
        name={ name } 
        type={ type }
        placeholder={ placeholder }
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