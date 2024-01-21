import styled from "styled-components";
import Seperator from "atoms/Seperator";
import { LoginForm } from "organisms/LoginForm";
import CreateAccountComponent from "molecules/CreateAccount";

import CenterContainer from "atoms/CenterContainer";

const LoginPage = () => {
  return (
    <CenterContainer>
      <Container>
        <LoginForm/>
        
        <Seperator/>
          
        <CreateAccountComponent/>
      </Container>
    </CenterContainer>
  );
};

export default LoginPage;

/** 
 * This container prevents the seperator from becoming the full width of the screen and instead
 * causes the seperator to become the full width of this container which becomes the width
 * of the largest elemenet contained inside of it.
**/

const Container = styled.div``
