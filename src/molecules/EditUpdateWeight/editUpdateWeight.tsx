import ErrorMessage from 'atoms/ErrorMessage';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import LoadingButton from 'atoms/LoadingButton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import dayjs, { Dayjs } from 'dayjs';
import { dateObjectToFormattedDate } from 'lib/dateUtils';
import { SyntheticEvent, useState } from 'react';
import { createNewWeight, updateWeight } from 'services/WeightTracking/WeightTracking';
import styled from 'styled-components';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    getDefaultValue, getNotesFromDate, getResultsFromForm, getWeightText
} from './editUpdateAlgorithms';
import { Props } from './editUpdateInterfaces';

const EditUpdateWeight: React.FC<Props> = ({ closeModalWindow}) => {
    const today = dayjs(new Date());

    const { displayUnit, datesWithWeight, dateToNotes, dateToWeightKg,setPartialState} = useWeightTrackingGraphContext();

    const [date, setDate] = useState<Dayjs>(today);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const formattedDate = dateObjectToFormattedDate(date);
    const updating = datesWithWeight.includes(formattedDate);;

    const onSubmit = async(event: SyntheticEvent) => {
        event.preventDefault();

        const [date, weight_kg, notes] = getResultsFromForm(event, displayUnit);

        setIsLoading(true);

        const apiCall = updating ? updateWeight : createNewWeight;
        apiCall(date, weight_kg, notes).then((success) => {
            // @ts-ignore
            if (success) {
                dateToWeightKg[formattedDate] = weight_kg;
                dateToNotes[formattedDate] = notes;

                if (!datesWithWeight.includes(formattedDate)) {
                    datesWithWeight.push(formattedDate);
                }
                setPartialState({
                    dateToWeightKg,
                    dateToNotes,
                    datesWithWeight
                })
                closeModalWindow(true);
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
                    <form onSubmit={ onSubmit } className="w-80">
                        <button onClick={ () => closeModalWindow(false) } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <div className="flex flex-col">
                            <div className="flex w-full items-center justify-center">
                                <div className="mb-5">
                                    <DatePicker
                                        name='datePicker'
                                        className='w-48'
                                        label={ updating ? `Updating weight on` : `Add weight on` }
                                        defaultValue={ today }
                                        maxDate={ today }
                                        // @ts-ignore - Remove the null type check as we will never receive it.
                                        onChange={ (v: Dayjs) => setDate(v) }
                                    />
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <WeightTrackingSpinbutton 
                                    defaultValue={ getDefaultValue() }
                                    displayUnit={ displayUnit }
                                    name={ "weightInput" }
                                    label={ getWeightText(updating, formattedDate) }
                                />
                            </div>
                        </div>

                        <div className="mb-5 w-full">
                            <TextField
                                id="notesTextArea"
                                className="resize-none w-full" 
                                defaultValue={ getNotesFromDate(formattedDate) }
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
