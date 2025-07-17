import CenterContainer from 'atoms/design_patterns/CenterContainer';
import Seperator from 'atoms/Seperator';
import CreateAccountComponent from 'molecules/CreateAccount';
import { LoginForm } from 'organisms/LoginForm';
import LoginPageBackground from './LoginPageBackground';

const LoginPageContainer: React.FC<LoginPageContainerProps> = ({ children }) => {
    const containerStyle: React.CSSProperties = {
      padding: '20px',
      backgroundColor: 'white',
      border: `1px solid black`,
      borderRadius: '8px',
      boxSizing: 'border-box',
    };

  return (
      <div style={containerStyle} className="w-[80%] sm:w-[60%] md:w-[45%] lg:w-[35%] xl:w-[20%]">
        {children}
      </div>
  );
};

const LoginPage = () => {
  return (
    <CenterContainer>
      <LoginPageContainer>
        <LoginPageBackground />

        <LoginForm/>
        
        <Seperator/>
          
        <CreateAccountComponent/>
      </LoginPageContainer>
    </CenterContainer>
  );
};

export default LoginPage;
