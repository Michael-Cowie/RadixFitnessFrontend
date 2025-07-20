import CenterContainer from 'atoms/design_patterns/CenterContainer';
import Seperator from 'atoms/Seperator';
import { LoginForm } from 'organisms/LoginForm';
import LoginPageBackground from './LoginPageBackground';
import CreateAccountComponent from 'molecules/CreateAccount/CreateAccount';
import { FORM_RESIZER } from 'atoms/design_patterns/constants';
import { LoginPageContainerProps } from './LoginPageInterfaces';

const LoginPageContainer: React.FC<LoginPageContainerProps> = ({ children }) => {
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: 'white',
    border: `1px solid black`,
    borderRadius: '8px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle} className={FORM_RESIZER}>
      {children}
    </div>
  );
};

const LoginPage = () => {
  return (
    <CenterContainer>
      <LoginPageContainer>
        <LoginPageBackground />

        <LoginForm />

        <Seperator />

        <CreateAccountComponent />
      </LoginPageContainer>
    </CenterContainer>
  );
};

export default LoginPage;
