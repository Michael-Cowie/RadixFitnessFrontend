import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import ModalForm from 'atoms/design_patterns/ModalForm';
import ErrorMessage from 'atoms/ErrorMessage';
import { ValidatedInputWithLabel } from 'atoms/inputs/ValidatedInputWithLabel';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  methods: UseFormReturn<any>;
  closeModalWindow: () => void;
  isLoading: boolean;
  errorMessage: string;
  onSubmit: (data: any) => void;
}

const CreateAccountModal: React.FC<Props> = ({
  methods,
  closeModalWindow,
  isLoading,
  errorMessage,
  onSubmit
}) => {
  return (
    <ModalForm
      onSubmit={methods.handleSubmit(onSubmit)}
      closeModalWindow={closeModalWindow}
      formProviderProps={methods}
    >
      <GroupContainer>
        <Group title="Create an Account">
          <div className="mt-1 space-y-2">
            <ValidatedInputWithLabel
              label="Email"
              name="email"
              register={methods.register}
              error={methods.formState.errors.email?.message as string}
            />
            <ValidatedInputWithLabel
              label="Password"
              name="password"
              type="password"
              register={methods.register}
              error={methods.formState.errors.password?.message as string}
            />
            <SubmitButton displayLoadingAnimation={isLoading} />
            <ErrorMessage errorMessage={errorMessage} />
          </div>
        </Group>
      </GroupContainer>
    </ModalForm>
  );
};

export default CreateAccountModal;
