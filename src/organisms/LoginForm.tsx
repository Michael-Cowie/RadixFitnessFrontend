import ErrorMessage from 'atoms/ErrorMessage';
import { InputWithLabel } from 'atoms/inputs/InputWithLabel';
import LoadingButton from 'atoms/LoadingButton';
import useAuth from 'context/AuthContext/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const navigate = useNavigate();

  const { userIsLoggedIn, loginUser } = useAuth();

  const [loginError, setLoginError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userIsLoggedIn) { 
      navigate('/');
    }
  }, [userIsLoggedIn])

  const onLogin = async(event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    setIsLoading(true);

    loginUser(email.value, password.value).then((successful) => {
      setLoginError(successful === false);
      setIsLoading(false);
    })
  };

  return (
    <div>
        <form onSubmit={ onLogin }>
            <InputWithLabel
              label="Email "
              name="email"
              placeholder="Email is not verified during creation"
            />
            <InputWithLabel
              label="Password "
              name="password"
              type="password"
            />

            { loginError && <ErrorMessage errorMessage="Invalid Email or Password"/> }

            <LoadingButton 
              buttonText="Log in" 
              displayLoadingAnimation={ isLoading }
              displayIcon={ true }
            />
        </form>
      </div>
  );
};
