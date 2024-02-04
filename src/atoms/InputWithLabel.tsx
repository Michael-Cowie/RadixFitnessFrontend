import styled from 'styled-components';

export interface Props {
  label: string,
  name: string,
  type?: string,
  placeholder?: string
}

export const InputWithLabel: React.FC<Props> = ({ label, name, type="text", placeholder="Type here" }) => {
  return (
        <Container>
          <Label className="font-sans font-black">
            { label }
          </Label>

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

const Label = styled.div`
  margin-right: 10px;
  margin-bottom: 15px;
  font-weight: bold;
  font-family: sans-serif;
`