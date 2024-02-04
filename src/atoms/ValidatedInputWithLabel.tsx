import ErrorMessage from 'atoms/ErrorMessage';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

interface Props {
  label: string,
  name: string,
  type?: string,
  placeholder?: string
}

/**
 * ValidatedInputWithLabel is a component that utilizes the "react-hook-form" library
 * and needs to be inside a FormProvider component. The FormProvider contains the schema
 * within the context, providing validation for the input by retrieving it via the 
 * register object.
 * 
 * For further documentation, please read https://react-hook-form.com/docs/formprovider.
 * 
 * @param { string } label - The label to be displayed above the input.
 * @param { string } name  - The name for the input and must be identical to the name on the schema zod object.
 * @param { string } type  - The input type, e.g. text or password.
 */
export const ValidatedInputWithLabel: React.FC<Props> = ({ label, name, type="text", placeholder="Type Here" }) => {
  const { register, formState: { errors }} = useFormContext();

  const error_for = errors[name]
  const error_message = error_for?.message?.toString();
  return (
        <Container>
          <Label className="font-sans font-black">
            { label }
          </Label>

          <input
            { ...register(name) }
            className="border-2 input input-bordered w-full max-w-xs"
            name={ name } 
            type={ type }
            placeholder={ placeholder }
          />

          <ErrorMessage errorMessage={ error_message } />
        </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const Label = styled.div`
  margin-right: 10px;
  margin-bottom: 15px;
  font-weight: bold;
  font-family: sans-serif;
`