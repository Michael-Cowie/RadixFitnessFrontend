import styled from "styled-components";
import Seperator from "atoms/Seperator";
import { LoginForm } from "organisms/LoginForm";
import CreateAccountComponent from "molecules/CreateAccount";

const LoginPage = () => {
  return (
    <FlexContainer>
      <Container>
        <LoginForm/>
        
        <Seperator/>
          
        <CreateAccountComponent/>
      </Container>
    </FlexContainer>
  );
};

export default LoginPage;

const Container = styled.div``

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`