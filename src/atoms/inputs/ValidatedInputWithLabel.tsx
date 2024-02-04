import ErrorMessage from 'atoms/ErrorMessage';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Label } from './shared';

interface Props {
  label: string,
  name: string,
  type?: string,
  placeholder?: string
}

/**
 * ValidatedInputWithLabel is a component that utilizes the "react-hook-form" library
 * and needs to be inside a FormProvider component.
 * 
 * For further documentation, please read https://react-hook-form.com/docs/formprovider.
 * 
 * @param { string } label - The label to be displayed above the input.
 * @param { string } name  - The name for the input
 * @param { string } type  - The input type, e.g. text or password.
 */
export const ValidatedInputWithLabel: React.FC<Props> = ({ label, name, type="text", placeholder="Type Here" }) => {
  const { register, formState: { errors }} = useFormContext();

  const error_for = errors[name]
  const error_message = error_for?.message?.toString();
  return (
    <Container>
      <Label> { label } </Label>

      <input
        { ...register(name, {
          required: true,
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: 'Name must only contain alphabetical characters'
          }
        })}

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