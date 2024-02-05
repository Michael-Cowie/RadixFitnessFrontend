import { useFormContext } from 'react-hook-form';

import { Label } from './shared';

interface Props {
    name: string, 
    label: string,
    options: string[],
    defaultIndex?: number
}


/**
 * SelectionInput is a component that utilizes the "react-hook-form" library
 * and needs to be inside a FormProvider component.
 * 
 * For further documentation, please read https://react-hook-form.com/docs/formprovider.
 * 
 * @param { string } name  - The name for the input
 * @param { string } label - The label to be displayed above the input.
 * @param { string[] } options  - A list of strings that will be selectable options.
 * @param { number } defaultIndex - The index of the default selection option.
 */
export const SelectionInput: React.FC<Props> = ({ name, label, options, defaultIndex = 0 }) => {
  const { register } = useFormContext();

  return (
      <div>
          <Label> { label } </Label>

          <select 
              { ...register(name, {
                required: true
              })}
              className="select select-bordered w-full mb-5"
              name={ name }
              defaultValue={options[defaultIndex]}
          >
              {options.map((option, i) => (
                  <option value={ option } key={ i }> { option } </option>
              ))}
          </select>
      </div>
  )
}

export default SelectionInput;
