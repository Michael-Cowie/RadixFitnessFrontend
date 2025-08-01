import styles from 'lib/colours.module.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createNewUser } from 'services/FirebaseUtils';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import CreateAccountModal from './CreateAccountModalForm';
import { FirebaseError } from 'firebase/app';

import * as Sentry from '@sentry/react';

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^[a-zA-Z0-9]*$/, 'Password must be alphanumeric'),
});

export type CreateAccountFormData = z.infer<typeof schema>;

const CreateAccountComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const attemptCreateNewUser = async (data: CreateAccountFormData): Promise<void> => {
    setIsLoading(true);
    setErrorMessage('');

    createNewUser(data.email, data.password)
      .then(() => setShowModal(false))
      .catch((error: FirebaseError) => {
        Sentry.captureException(error);

        setErrorMessage(error.code || 'auth/unknown-error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const methods = useForm<CreateAccountFormData>({
    resolver: zodResolver(schema),
  });
  return (
    <div>
      <button
        className={`${styles.blueWithHover} btn w-full font-sans font-black`}
        type="submit"
        onClick={() => setShowModal(true)}
      >
        Create an account
      </button>

      {showModal && (
        <CreateAccountModal
          methods={methods}
          onSubmit={attemptCreateNewUser}
          isLoading={isLoading}
          errorMessage={errorMessage}
          closeModalWindow={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CreateAccountComponent;
