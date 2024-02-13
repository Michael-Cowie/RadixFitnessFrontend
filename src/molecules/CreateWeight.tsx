import 'react-datepicker/dist/react-datepicker.css';

import ErrorMessage from 'atoms/ErrorMessage';
import { dateObjectToFormattedDate } from 'lib/dateUtils';
import { SyntheticEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { DateToUserData } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { createNewWeight, updateWeight } from 'services/WeightTracking/WeightTracking';
import styled from 'styled-components';

interface Props {
    displayUnit: string
    onSuccess: Function,
    closeModalWindow: () => void,
    dateData: DateToUserData,
    defaultValue: string
}

function getWeightFromDate(dateData: DateToUserData, date:string): string {
    return dateData[date].weight_kg
}

function getNotesFromDate(dateData: DateToUserData, date:string): string {
    if (date in dateData) {
        return dateData[date].notes;
    }
    return '';
}

function getWeightText(updating: boolean, displayUnit: string, dateData: DateToUserData, formattedDate: string): string {
    if (!updating) {
        return `Weight in ${ displayUnit }`;
    } 
    const weight = getWeightFromDate(dateData, formattedDate);
    return `From ${weight}${displayUnit} to`
}

function getResultsFromForm(event: SyntheticEvent): string {
    const form = event.target as HTMLFormElement
    const weightInput = form.elements.namedItem('weightInput') as HTMLInputElement;
    const weight_kg = weightInput.value;
    return weight_kg;
}

const CreateWeight: React.FC<Props> = ({ displayUnit, onSuccess, dateData, defaultValue, closeModalWindow}) => {
    const [date, setDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState<string>('');

    const formattedDate = dateObjectToFormattedDate(date);
    const updating = formattedDate in dateData;

    const onSubmit = async(event: SyntheticEvent)=> {
        event.preventDefault();
        
        const formattedDate = dateObjectToFormattedDate(date);
        const weight_kg = getResultsFromForm(event);
        const notes =(document.getElementById('notesTextArea') as HTMLTextAreaElement).value;

        const success = updating ? await updateWeight(formattedDate, weight_kg, notes) : await createNewWeight(formattedDate, weight_kg, notes);

        // @ts-ignore
        if (success) {
            onSuccess(weight_kg, notes);
        } else {
            setErrorMessage(`Unable to ${updating ? 'update' : 'add'} weight`);
        }
    };

    const weightText = getWeightText(updating, displayUnit, dateData, formattedDate);
    return (
        <dialog id="my_modal" className={"modal modal-open"}>
            <div className="modal-box h-96">
                <FormContainer>
                    <form onSubmit={ onSubmit }>
                        <button onClick={ () => closeModalWindow() } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <RowAlignment className="mb-4">
                            <div className="mr-2 font-bold"> {updating ? `Updating weight on` : `Add weight on`} </div>
                            
                            <DatePicker
                                className="w-32"
                                showIcon
                                selected={ date }
                                onChange={ (v: Date) => setDate(v) }
                                maxDate={ new Date() }
                            />
                        </RowAlignment>
                        
                        <div className="mb-4">
                            <label className="mr-2 font-bold"> { weightText } </label>

                            <input 
                                type="number" 
                                name="weightInput" 
                                step="0.10" 
                                min="1" 
                                max="1000" 
                                defaultValue={ defaultValue }
                                required
                            />
                        </div>

                        <div className="w-100 text-center font-bold mb-2">
                            Notes
                        </div>

                        <textarea 
                            id="notesTextArea" 
                            className="mb-4 resize-none" 
                            rows={ 3 } 
                            cols={ 30 } 
                            maxLength={ 255 }
                            placeholder="Optional notes"
                            value={ getNotesFromDate(dateData, formattedDate) }
                        />

                        <div className="w-100 text-center">
                            <button type="submit" className="btn w-32"> Submit </button>
                        </div>
                    </form>
                    <ErrorMessage errorMessage={ errorMessage } />
                </FormContainer>
            </div>
        </dialog>
    );
}

const RowAlignment = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default CreateWeight;