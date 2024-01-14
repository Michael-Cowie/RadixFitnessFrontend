import {  useState } from "react";
import { createProfile } from "services/Profile";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ValidatedInputWithLabel } from "atoms/ValidatedInputWithLabel";
import ErrorMessage from "atoms/ErrorMessage";
import Title from "atoms/Title";
import styled from "styled-components";

const schema = z.object({
    name: z
          .string()
          .regex(/^[a-zA-Z]*$/, 'Name must only contain alpha characters'),
});

const CreateProfile = () => {
    const [showModal, setShowModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const methods = useForm({
        resolver: zodResolver(schema),
    });

    const attemptCreateNewProfile = async(data: any): Promise<void> => {
        // @ts-ignore
        const success = await createProfile(data.name);
        if (success) {
            setShowModal(false)
        }
        setErrorMessage('Unable to create profile')
      };

    return (
        <div>
            <dialog id="my_modal" className={`modal ${showModal ? 'modal-open' : 'modal-close'}`}>
                <div className="modal-box">
                    <FormProvider { ...methods }>
                        <FormContainer>
                            <Title> It's time to create your profile! </Title>
                            <form onSubmit={ methods.handleSubmit(attemptCreateNewProfile) }>
                                <div className="mb-5">
                                    <ValidatedInputWithLabel 
                                        label="Name" 
                                        name="name"
                                    />
                                </div>

                                <div className="w-100 text-center">
                                    <button type="submit" className="btn w-32"> Continue </button>
                                </div>
                            
                                <ErrorMessage errorMessage={errorMessage} />
                            </form>
                        </FormContainer>
                    </FormProvider>
                </div>
            </dialog>
        </div> 
    );
}

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default CreateProfile;
