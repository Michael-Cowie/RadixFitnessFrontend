import ErrorMessage from 'atoms/ErrorMessage';
import { InputWithLabel } from 'atoms/inputs/InputWithLabel';
import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from 'context/AuthContext/hooks';

import * as Sentry from '@sentry/react';

export const LoginForm = () => {
  const navigate = useNavigate();

  const { userIsLoggedIn, loginUser } = useAuthContext();

  const [loginError, setLoginError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userIsLoggedIn) {
      navigate('/');
    }
  }, [userIsLoggedIn, navigate]);

  const onLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    setIsLoading(true);

    loginUser(email.value, password.value)
      .then(() => {
        setLoginError(false);
      })
      .catch((error) => {
        Sentry.captureException(error);

        setLoginError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={onLogin}>
        <InputWithLabel label="Email " name="email" />
        <InputWithLabel label="Password " name="password" type="password" />

        {loginError && <ErrorMessage errorMessage="Invalid Email or Password" />}

        <SubmitButtonWithProgress
          buttonText="YOU'RE ON FEATURE BRANCH Feature/Login-form"
          displayLoadingAnimation={isLoading}
        />
      </form>
    </div>
  );
};
