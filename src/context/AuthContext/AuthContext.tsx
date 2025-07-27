import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { loginUser, signOutUser } from 'services/FirebaseUtils';

import { AuthProviderContextData, Props } from './AuthContextInterfaces';

const auth = getAuth(); // getAuth() returns the same object each time, hence, only call it once.

export const AuthContext = createContext<AuthProviderContextData>({
  loading: true,
  user: null,
  userIsLoggedIn: false,
  loginUser: loginUser,
  logoutUser: async () => {},
});

export const AuthContextComponent: React.FC<Props> = ({ children }) => {
  /**
   * The authentication loading state could potentially be renamed to initializing,
   * as it will be initialized to True and will be set to False when the Firebase
   * callbacks and initiailization is complete. Once the loading state is set
   * to False, it will not be set back to True, even if the users logs out
   * and then back in again. The handling of contexts from logging in and out
   * will be done using the user and userIsLoggedIn states.
   */
  const logoutUser = async () => {
    signOutUser()
      .then(() => setUserIsLoggedIn(false))
      .catch(() => {});
  };

  const [loading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<User | null>(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (newUser: User | null) => {
      /* 
              Retrieve the idToken from Firebase and then finish loading.

              The user is unitialized and null when first loading the webpage. Hence, we set the loading
              state to true. Here, loading the webpage refers to us waiting for Firebase to initialize
              and check the user. The user can stay null or be initialized (logged in), therefore no matter 
              the response we set the loading state to false once Firebase has responded.

              We do not store the responded idToken, this initializes it for future use when making
              API requests to our backend and is retrieved by the Firebase getAuth(). Requests
              will only be made to the Firebase API if the token is expired, calling getIdToken
              will cache it for future use.
            */
      setUser(newUser);
      setLoading(false);
      setUserIsLoggedIn(!!newUser);
    });
  }, []); // Pass an array, so that that is called when we have been added to the DOM (first render) and not each re-render.
  return (
    /*
         Calling useContext(AuthContext) will return the value of "value" here. Hence, 
         useAuthContext() is a shortcut to reduce calling this in multiple locations.
        
         Then, using it such as,

         const { userIsLoggedIn } = useAuthContext();

         will destruct and pull "userIsLoggedIn" from the object.
        */
    <AuthContext.Provider value={{ loading, user, userIsLoggedIn, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
