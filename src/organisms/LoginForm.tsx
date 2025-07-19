import ErrorMessage from 'atoms/ErrorMessage';
import { InputWithLabel } from 'atoms/inputs/InputWithLabel';
import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
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
            />
            <InputWithLabel
              label="Password "
              name="password"
              type="password"
            />

            { loginError && <ErrorMessage errorMessage="Invalid Email or Password" /> }


            <SubmitButtonWithProgress 
              buttonText="Log in" 
              displayLoadingAnimation={ isLoading }
              iconSrc={ '/flexing_arm.svg' }
            />
        </form>
      </div>
  );
};
