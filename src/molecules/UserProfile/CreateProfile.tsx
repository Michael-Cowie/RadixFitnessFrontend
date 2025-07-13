import ErrorMessage from 'atoms/ErrorMessage';
import SelectionInput from 'atoms/inputs/SelectionInput';
import { ValidatedInputWithLabel } from 'atoms/inputs/ValidatedInputWithLabel';
import Title from 'atoms/Title';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { saveProfile } from 'services/Profile/Profile';
import { measurementSystems } from 'services/Profile/ProfileInterfaces';

import { FormContainer } from './shared';

const CreateProfile = () => {
    const [showModal, setShowModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const selectionOptionsName = 'selectionOptionsName';

    const methods = useForm();

    const attemptCreateNewProfile = async(data: any): Promise<void> => {
        // @ts-ignore
        const success = await saveProfile(data.name, data.selectionOptionsName);
        if (success) {
            setShowModal(false)
        }
        setErrorMessage('Unable to create profile')
      };

    return (
        <div>
            <dialog id="my_modal" className={ `modal ${ showModal ? 'modal-open' : 'modal-close' }` }>
                <div className="modal-box">
                    <FormProvider { ...methods }>
                        <FormContainer>
                            <Title> Time to create your profile! </Title>
                            <form className="w-80" onSubmit={ methods.handleSubmit(attemptCreateNewProfile) }>
                                <ValidatedInputWithLabel 
                                    label="Name" 
                                    name="name"
                                />

                                <SelectionInput 
                                    name={ selectionOptionsName } 
                                    label='Default measurement system' 
                                    options={ measurementSystems }
                                />

                                <div className="w-100 text-center">
                                    <button type="submit" className="btn w-32"> Continue </button>
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

export default CreateProfile;
