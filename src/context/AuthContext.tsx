import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginUser, signOutUser } from 'services/FirebaseUtils';

export interface AuthProviderContextData {
    loading: boolean,
    user: User | null,
    userIsLoggedIn: boolean,
    loginUser: (email: string, password: string) => Promise<boolean>,
    signOutUser: () => Promise<void>
}

export interface Props {
    children: ReactNode;
}

const auth = getAuth(); // getAuth() returns the same object each time, hence, only call it once.

const AuthContext = createContext<AuthProviderContextData>({
    "loading": true,
    "user": null,
    "userIsLoggedIn": false,
    "loginUser": loginUser,
    "signOutUser": signOutUser
});


export const AuthContextComponent: React.FC<Props> = ({ children}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (new_user: User | null) => {
             /** ----- DEBUGGING ----- */
            console.log("Access Token: ", new_user?.accessToken);

            /* 
              Retrieve the idToken from Firebase and then finish loading.

              The user is unitialized and null when first loading the webpage. Hence, we set the loading
              state to true. Here, loading the webpage refers to us waiting for Firebase to initialized
              and check the user. The user can stay null or be initialized (logged in), therefore no matter 
              the response we set the loading state to false once Firebase has responded.

              We do not store the responded idToken, this initializes it for future use when making
              API requests to our backend and is retrieved by the Firebase getAuth(). Requests
              will only be made to the Firebase API if the token is expired, calling getIdToken
              will cache it for future use.
            */
            setUser(new_user);
            setLoading(false);
        })
    }, []) // Pass an array, so that that is called when we have been added to the DOM (first render) and not each re-render.


    const userIsLoggedIn = user !== null;
    return (
        /*
         Calling useContext(AuthContext) will return the value of "value" here. Hence, 
         useAuthContext() is a shortcut to reduce calling this in multiple locations.
        
         Then, using it such as,

         const { userIsLoggedIn } = useAuthContext();

         will destruct and pull "userIsLoggedIn" from the object.
        */
        <AuthContext.Provider value={{ loading, user, userIsLoggedIn, loginUser, signOutUser }} >
            { children }
        </AuthContext.Provider>
    )
}

const useAuthContext = () => {
    return useContext(AuthContext);
}

export default useAuthContext;
