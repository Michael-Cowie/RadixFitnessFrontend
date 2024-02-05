import ErrorMessage from 'atoms/ErrorMessage';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Label } from './shared';

interface Props {
  label: string,
  name: string,
  type?: string,
  placeholder?: string
  defaultValue?: string
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
 * @param { string } placeholder - The default value that appears before typing into the box and will disappear when typing.
 * @param { string } defaultValue - The default value that appears as user editable text, overwrites the placeHolder if present.
 */
export const ValidatedInputWithLabel: React.FC<Props> = ({ label, name, type="text", placeholder="Type Here", defaultValue="" }) => {
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
            message: "Only alphabetical characters are supported"
          }
        })}

        className="border-2 input input-bordered w-full"
        name={ name } 
        type={ type }
        placeholder={ placeholder }
        defaultValue={ defaultValue }
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