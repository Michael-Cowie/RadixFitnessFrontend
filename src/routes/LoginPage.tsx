import CenterContainer from 'atoms/CenterContainer';
import EqualWidthContainer from 'atoms/EqualWidthContainer';
import Seperator from 'atoms/Seperator';
import CreateAccountComponent from 'molecules/CreateAccount';
import { LoginForm } from 'organisms/LoginForm';

const LoginPage = () => {
  return (
    <CenterContainer>
      <EqualWidthContainer>
        <LoginForm/>
        
        <Seperator/>
          
        <CreateAccountComponent/>
      </EqualWidthContainer>
    </CenterContainer>
  );
};

export default LoginPage;
