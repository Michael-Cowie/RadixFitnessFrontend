import ErrorMessage from 'atoms/ErrorMessage';
import SelectionInput from 'atoms/inputs/SelectionInput';
import { ValidatedInputWithLabel } from 'atoms/inputs/ValidatedInputWithLabel';
import Title from 'atoms/Title';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { saveProfile } from 'services/Profile/Profile';
import { measurementSystems } from 'services/Profile/ProfileInterfaces';
import styled from 'styled-components';

import useProfileContext from 'context/ProfileContext/ProfileContext';

const ProfileSettings = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');

    const measuremmentSystemName = 'measuremmentSystemName';

    const { updateProfileContext } = useProfileContext();

    const methods = useForm();

    const attemptCreateNewProfile = async(data: any): Promise<void> => {
        // @ts-ignore
        const success = await saveProfile(data.name, data.measuremmentSystemName);

        if (success) {
            const name = data.name;
            const measurementSystem = data.measuremmentSystemName;
            const hasProfile = true;
            updateProfileContext(name, measurementSystem, hasProfile);
        } else {
            setErrorMessage('Unable to create profile')
        }
      };

    return (
        <>
            <FormProvider { ...methods }>
                <FormContainer>
                    <Title>  Profile Settings </Title>

                    <form className="w-full" onSubmit={ methods.handleSubmit(attemptCreateNewProfile) }>
                        <ValidatedInputWithLabel 
                            label="Name" 
                            name="name"
                        />

                        <SelectionInput 
                            name={ measuremmentSystemName } 
                            label='Measurement system' 
                            options={ measurementSystems }
                        />

                        <div className="w-full text-center">
                            <button type="submit" className="btn w-1/2"> Continue </button>
                        </div>
                    
                        <ErrorMessage errorMessage={ errorMessage } />
                    </form>
                </FormContainer>
            </FormProvider>
        </> 
    );
}

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default ProfileSettings;
