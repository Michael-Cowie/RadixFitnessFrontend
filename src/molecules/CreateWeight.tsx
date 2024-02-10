import ErrorMessage from 'atoms/ErrorMessage';
import Title from 'atoms/Title';
import { SyntheticEvent, useState } from 'react';
import { createNewWeight, updateWeight } from 'services/WeightTracking/WeightTracking';
import styled from 'styled-components';

function getResultsFromForm(event: SyntheticEvent): string {
    const form = event.target as HTMLFormElement
    const weightInput = form.elements.namedItem('weightInput') as HTMLInputElement;
    const weight_kg = weightInput.value;
    return weight_kg;
}

interface Props {
    displayUnit: string
    onClose: Function,
    today: string,
    updating: boolean,
    defaultValue: string
}

const CreateWeight: React.FC<Props> = ({ displayUnit, onClose, today, updating, defaultValue }) => {
    const [errorMessage, setErrorMessage] = useState<string>('');

    const onSubmit = async(event: SyntheticEvent)=> {
        event.preventDefault();

        const weight_kg = getResultsFromForm(event);
        const success = updating ? await updateWeight(today, weight_kg) : await createNewWeight(today, weight_kg);

        // @ts-ignore
        if (success) {
            onClose(weight_kg);
        } else {
            setErrorMessage(`Unable to ${updating ? 'update' : 'add'} weight`);
        }
    };

    const displayText = updating ? `Updating weight on ${today}` : `Tracking progress on ${today}`;
    return (
        <dialog id="my_modal" className={"modal modal-open"}>
            <div className="modal-box">
                <FormContainer>
                    <form onSubmit={ onSubmit }>
                        <Title> { displayText } </Title>

                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>
                        
                        <div className="mb-5">
                            <label className="mr-2"> Weight in { displayUnit } </label>
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

                        <div className="w-100 text-center">
                            <button type="submit" className="btn w-32"> Submit </button>
                        </div>
                    </form>
                    <ErrorMessage errorMessage={errorMessage} />
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

export default CreateWeight;