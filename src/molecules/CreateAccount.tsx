import ErrorMessage from 'atoms/ErrorMessage';
import { ValidatedInputWithLabel } from 'atoms/inputs/ValidatedInputWithLabel';
import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
import Title from 'atoms/Title';
import styles from 'lib/colours.module.css';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createNewUser } from 'services/FirebaseUtils';
import styled from 'styled-components';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    email: z
          .string()
          .email('Invalid email format'),
    password: z
          .string()
          .min(6, 'Password must be at least 6 characters')
          .regex(/^[a-zA-Z0-9]*$/, 'Password must be alphanumeric'),
});


const CreateAccountComponent = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const attemptCreateNewUser = async(data: any): Promise<void> => {
        setIsLoading(true);

        createNewUser(data.email, data.password).then((result) => {
            if (!result.success) {
                setErrorMessage(result.message)
            }
            setIsLoading(false);
        })

    };
  
    const closeModalWindow = () => {
        // @ts-ignore
        document.getElementById('create_account_modal').close();
    }

    const methods = useForm({
        resolver: zodResolver(schema),
    });

    return (
        <div>
            <button 
                className={ `${ styles.blueWithHover } btn w-full font-sans font-black` }
                type="submit"
                // @ts-ignore
                onClick={ ()=>document.getElementById('create_account_modal').showModal() }
            >
               Create an account
            </button>

            <dialog id="create_account_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex justify-center">
                    <button 
                       className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                       onClick={ closeModalWindow }
                    >
                        ✕
                    </button>
                    <FormProvider { ...methods }>
                        <form onSubmit={ methods.handleSubmit(attemptCreateNewUser) }>
                            <Title> Create an Account </Title>
                            <InputFieldContainer>
                                <ValidatedInputWithLabel
                                    label="Email " 
                                    name="email" 
                                    type="text"
                                />

                                <ValidatedInputWithLabel
                                    label="Password "
                                    name="password"
                                    type="password"
                                />


                                <SubmitButtonWithProgress
                                    buttonText="Create account"
                                    displayLoadingAnimation={ isLoading }
                                    iconSrc={ '/flexing_arm.svg' }
                                />

                                <ErrorMessage errorMessage={ errorMessage } />
                            </InputFieldContainer>
                        </form>
                    </FormProvider>
                </div>
            </dialog>
        </div> 
    );
}

export default CreateAccountComponent;

const InputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
