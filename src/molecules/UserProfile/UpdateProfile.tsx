import ErrorMessage from 'atoms/ErrorMessage';
import SelectionInput from 'atoms/inputs/SelectionInput';
import { ValidatedInputWithLabel } from 'atoms/inputs/ValidatedInputWithLabel';
import Title from 'atoms/Title';
import useProfileContext from 'context/ProfileContext/ProfileContext';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { saveProfile } from 'services/Profile/Profile';

import { FormContainer } from './shared';

interface Props {
    onSuccess: Function   
}


const selectionOptions = ['Metric', 'Imperial'];

const UpdateProfile: React.FC<Props> = ({ onSuccess }) => {
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { updateProfileContext, name, measurementSystem } = useProfileContext();

    const methods = useForm();

    const measurementSystemName = 'measurementSystemName';

    const attemptUpdateProfile = async(data: any): Promise<void> => {
        // @ts-ignore
        const success = await saveProfile(data.name, data.measurementSystemName);
        if (success) {
            updateProfileContext(data.name, data.measurementSystemName)
            onSuccess()
        }
        setErrorMessage('Unable to update profile')
    };

    return (
        <div>
            <dialog id="my_modal" className={`modal modal-open`}>
                <div className="modal-box">
                    <FormProvider { ...methods }>
                        <FormContainer>
                            <button 
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={ () => onSuccess() }
                            > ✕ </button>

                            <Title> Updating Profile </Title>
                            <form className="w-80" onSubmit={ methods.handleSubmit(attemptUpdateProfile) }>
                                <ValidatedInputWithLabel 
                                    label="Name"
                                    name="name"
                                    defaultValue={ name }
                                />

                                <SelectionInput 
                                    name={ measurementSystemName } 
                                    label="Default unit"
                                    options={ selectionOptions }
                                    defaultIndex={ selectionOptions.indexOf(measurementSystem) }
                                />

                                <div className="text-center">
                                    <button type="submit" className="btn w-32"> Submit </button>
                                </div>
                            
                                <ErrorMessage errorMessage={ errorMessage } />
                            </form>
                        </FormContainer>
                    </FormProvider>
                </div>
            </dialog>
        </div> 
    );
}

export default UpdateProfile;
