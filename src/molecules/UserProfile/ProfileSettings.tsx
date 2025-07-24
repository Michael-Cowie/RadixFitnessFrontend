import ErrorMessage from 'atoms/ErrorMessage';
import SelectionInput from 'atoms/inputs/SelectionInput';
import { ValidatedInputWithLabel } from 'atoms/inputs/ValidatedInputWithLabel';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { measurementSystems } from 'services/Profile/ProfileInterfaces';
import { useNavigate } from 'react-router-dom';
import useProfileContext from 'context/ProfileContext/hooks';

const measurementSystemField = 'measurementSystem' as const;

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-zA-Z]+$/, 'Name must only contain letters'),
  [measurementSystemField]: z.enum(measurementSystems, {
    required_error: 'Measurement system is required',
  }),
});

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    createAndSaveProfile,
    hasProfile,
    name: profileName,
    measurementSystem,
  } = useProfileContext();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: hasProfile ? profileName : '',
      [measurementSystemField]: hasProfile ? measurementSystem : measurementSystems[0],
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const attemptCreateNewProfile = (data: z.infer<typeof schema>): void => {
    setIsLoading(true);
    const name = data.name;
    const system = data[measurementSystemField];

    createAndSaveProfile(name, system)
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setErrorMessage('Unable to create profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <FormProvider {...methods}>
      <GroupContainer>
        <Group title="Profile Settings">
          <form onSubmit={handleSubmit(attemptCreateNewProfile)}>
            <ValidatedInputWithLabel
              label="Name"
              name="name"
              register={register}
              error={errors.name?.message as string}
            />

            <SelectionInput
              name={measurementSystemField}
              label="Measurement system"
              options={measurementSystems}
            />

            <SubmitButton displayLoadingAnimation={isLoading} />

            <ErrorMessage errorMessage={errorMessage} />
          </form>
        </Group>
      </GroupContainer>
    </FormProvider>
  );
};

export default ProfileSettings;
