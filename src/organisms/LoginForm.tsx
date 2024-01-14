import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputWithLabel } from "atoms/InputWithLabel";
import { FlexingArmButton } from "atoms/FlexingArmButton";
import useAuth from "context/AuthContext";
import ErrorMessage from "atoms/ErrorMessage";


export const LoginForm = () => {
  const navigate = useNavigate();

  const { userIsLoggedIn, loginUser } = useAuth();

  const [loginError, setLoginError] = useState<boolean>(false);

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

    const successful = await loginUser(email.value, password.value);
    setLoginError(successful === false);
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

            { loginError && <ErrorMessage errorMessage="Invalid Email or Password"/> }

            <FlexingArmButton label="Log in" />
        </form>
      </div>
  );
};
