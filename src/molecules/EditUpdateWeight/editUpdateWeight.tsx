import ErrorMessage from 'atoms/ErrorMessage';
import LoadingButton from 'atoms/LoadingButton';
import dayjs, { Dayjs } from 'dayjs';
import { dateObjectToFormattedDate } from 'lib/dateUtils';
import { FormEvent, SyntheticEvent, useState } from 'react';
import { convertWeight } from 'services/WeightTracking/utils';
import { createNewWeight, updateWeight } from 'services/WeightTracking/WeightTracking';
import styled from 'styled-components';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import styles from './editUpdate.module.css';
import {
    getDefaultValue, getNotesFromDate, getResultsFromForm, getWeightText, validateInput
} from './editUpdateAlgorithms';
import { Props } from './editUpdateInterfaces';

const EditUpdateWeight: React.FC<Props> = ({ displayUnit, onSuccess, dateData, closeModalWindow}) => {
    const [date, setDate] = useState(dayjs(new Date()));

    const formattedDate = dateObjectToFormattedDate(date);
    const defaultValue = getDefaultValue(formattedDate, displayUnit, dateData);
    const updating = formattedDate in dateData;

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async(event: SyntheticEvent) => {
        event.preventDefault();
        
        const formattedDate = dateObjectToFormattedDate(date);
        const weight_kg = convertWeight(displayUnit, "kg", getResultsFromForm(event));
        const notes = (document.getElementById('notesTextArea') as HTMLTextAreaElement).value;

        setIsLoading(true);

        const apiCall = updating ? updateWeight : createNewWeight;
        apiCall(formattedDate, weight_kg, notes).then((success) => {
            // @ts-ignore
            if (success) {
                onSuccess(formattedDate, weight_kg, notes);
            } else {
                setErrorMessage(`Unable to ${ updating ? 'update' : 'add' } weight`);
            }

            setIsLoading(false);
        })
    };

    return (
        <dialog id="my_modal" className={"modal modal-open"}>
            <div className="modal-box h-96">
                <FormContainer>
                    <form onSubmit={ onSubmit }>
                        <button onClick={ () => closeModalWindow() } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <div className="grid grid-cols-2 grid-rows-2 gap-2 gap-y-6 mb-5">
                            {/* Grid Row 1 - Column 1 */}
                            <div className="flex items-center justify-end font-bold mr-2">
                                { updating ? `Updating weight on` : `Add weight on` }
                            </div>

                            {/* Grid Row 1 - Column 2 */}
                            <div className="flex items-center">
                                <DatePicker
                                    className='w-40'
                                    label="Choose a date"
                                    defaultValue={ date }
                                    maxDate={ dayjs(new Date()) }
                                    onChange={ (v: Dayjs | null) => setDate(v) }
                                />
                            </div>

                            {/* Grid Row 2 - Column 1 */}
                            <div className="flex items-center font-bold justify-end mr-2">
                                { getWeightText(updating, displayUnit, dateData, formattedDate) }
                            </div>

                            {/* Grid Row 2 - Column 2 */}
                            <div className="flex items-center">
                                <div className={`${ styles.weightUnitWrapper } ${ styles[displayUnit] }` }>
                                    <TextField
                                        id="weightInput"
                                        name="weightInput"
                                        label="Weight"
                                        type="number"
                                        className="w-40"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps= {{
                                            step: 0.01,
                                            min: 1,
                                            max: 1000
                                        }}
                                        defaultValue={ defaultValue.toFixed(2) }
                                        onInput={ (e: FormEvent<HTMLInputElement>) => validateInput(e) }
                                        key={ defaultValue }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-5 flex justify-start w-full">
                            <TextField 
                                id="notesTextArea"
                                className="resize-none w-full" 
                                defaultValue={ getNotesFromDate(dateData, formattedDate) }
                                placeholder="Optional notes"
                                label="Notes"
                                variant="outlined" 
                                multiline
                                rows={3}
                            />
                        </div>

                        <div className="w-100 flex justify-center items-center">
                            <div className="w-40">
                                <LoadingButton
                                    buttonText="Submit"
                                    displayLoadingAnimation={ isLoading }
                                />
                            </div>
                            
                        </div>
                    </form>
                    <ErrorMessage errorMessage={ errorMessage } />
                </FormContainer>
            </div>
        </dialog>
    );
}

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default EditUpdateWeight;