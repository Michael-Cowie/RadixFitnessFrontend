import { useFormContext } from 'react-hook-form';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
        <div className="mt-7 mb-7">
            <FormControl className="w-full">
                <InputLabel id="demo-simple-select-label"> { label } </InputLabel>
                <Select 
                    { ...register(name, {
                        required: true
                    })}
                    label={ label }
                    name={ name }
                    defaultValue={ options[defaultIndex] }
                >
                    { options.map((option, i) => (
                        <MenuItem value={ option } key={ i }> { option } </MenuItem>
                    )) }
                </Select>
            </FormControl>
        </div>
  )
}

export default SelectionInput;
