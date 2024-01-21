import Seperator from "atoms/Seperator";
import { LoginForm } from "organisms/LoginForm";
import CreateAccountComponent from "molecules/CreateAccount";
import EqualWidthContainer from "atoms/EqualWidthContainer";
import CenterContainer from "atoms/CenterContainer";

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
