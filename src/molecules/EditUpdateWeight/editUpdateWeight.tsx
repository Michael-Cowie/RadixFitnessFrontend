import 'react-datepicker/dist/react-datepicker.css';

import ErrorMessage from 'atoms/ErrorMessage';
import { dateObjectToFormattedDate } from 'lib/dateUtils';
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { convertWeight } from 'services/WeightTracking/utils';
import { createNewWeight, updateWeight } from 'services/WeightTracking/WeightTracking';
import styled from 'styled-components';

import styles from './editUpdate.module.css';
import {
    getDefaultValue, getNotesFromDate, getResultsFromForm, getWeightText, validateInput
} from './editUpdateAlgorithms';
import { Props } from './editUpdateInterfaces';

const EditUpdateWeight: React.FC<Props> = ({ displayUnit, onSuccess, dateData, closeModalWindow}) => {
    const [date, setDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState<string>('');

    const formattedDate = dateObjectToFormattedDate(date);
    const defaultValue = getDefaultValue(formattedDate, displayUnit, dateData);
    const updating = formattedDate in dateData;

    const onSubmit = async(event: SyntheticEvent)=> {
        event.preventDefault();
        
        const formattedDate = dateObjectToFormattedDate(date);
        const weight_kg = convertWeight(displayUnit, "kg", getResultsFromForm(event));
        
        const notes = (document.getElementById('notesTextArea') as HTMLTextAreaElement).value;

        const success = updating ? await updateWeight(formattedDate, weight_kg, notes) : await createNewWeight(formattedDate, weight_kg, notes);

        // @ts-ignore
        if (success) {
            onSuccess(formattedDate, weight_kg, notes);
        } else {
            setErrorMessage(`Unable to ${updating ? 'update' : 'add'} weight`);
        }
    };

    return (
        <dialog id="my_modal" className={"modal modal-open"}>
            <div className="modal-box h-96">
                <FormContainer>
                    <form onSubmit={ onSubmit }>
                        <button onClick={ () => closeModalWindow() } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <div className="grid grid-cols-2 grid-rows-2 gap-2 mb-5">
                            {/* Grid Row 1 - Column 1 */}
                            <div className="flex items-center justify-end font-bold mr-2">
                                {updating ? `Updating weight on` : `Add weight on`}
                            </div>

                            {/* Grid Row 1 - Column 2 */}
                            <div className="flex items-center">
                                <DatePicker
                                    className="w-32"
                                    showIcon
                                    selected={date}
                                    onChange={(v: Date) => setDate(v)}
                                    maxDate={new Date()}
                                />
                            </div>

                            {/* Grid Row 2 - Column 1 */}
                            <div className="flex items-center font-bold justify-end mr-2">
                                { getWeightText(updating, displayUnit, dateData, formattedDate) }
                            </div>

                            {/* Grid Row 2 - Column 2 */}
                            <div className="flex items-center">
                                <div className={`${styles.weightUnitWrapper} ${styles[displayUnit]}`}>
                                    <input
                                        id="weightInput"
                                        className="w-32"
                                        type="number"
                                        name="weightInput"
                                        step="0.01"
                                        min="1"
                                        max="1000"
                                        key={ defaultValue }
                                        defaultValue={ defaultValue }
                                        onInput={(e) => validateInput(e)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-100 text-center font-bold mb-2">
                            Notes
                        </div>

                        <textarea 
                            id="notesTextArea" 
                            className="mb-4 resize-none w-80" 
                            rows={ 3 } 
                            cols={ 30 } 
                            maxLength={ 255 }
                            placeholder="Optional notes"
                            defaultValue={ getNotesFromDate(dateData, formattedDate) }
                        />

                        <div className="w-100 text-center mb-1">
                            <button type="submit" className="btn w-32"> Submit </button>
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