import useAuthContext, { AuthContextComponent } from 'context/AuthContext';
import React, { ReactNode, useEffect, useState } from 'react';

import useProfileContext, { ProfileContextComponent } from './ProfileContext';

interface Props {
    children: ReactNode;
}

/**
 * The App component deals with the logic with making sure that the loading page
 * is presented while all contexts initialize (or until authentication fails).
 * 
 * Firstly, the authentication context must be completed prior to any other
 * contexts. This is important as the other contexts will be put inside a useEffect
 * and must not be ran prior to the authentication context completing as we do not
 * want any requests being made to the server without a user being logged in.
 */
const App: React.FC<Props> = ({ children }) => {
    let [loadingApplication, setLoadingApplication] = useState(true);

    const {loading: authLoading, userIsLoggedIn, user } = useAuthContext();
    const { loading: profileContextLoading } = useProfileContext();

    useEffect(() => {
        if (!authLoading && userIsLoggedIn) {
            const allUserContexts = [
                profileContextLoading,
            ];

            if (allUserContexts.every(v => !v)) {
                setLoadingApplication(false);
            }
        }

        if (!authLoading && !userIsLoggedIn) {
            setLoadingApplication(false);
        }
    /**
     * All context loading states need to be included in the dependency array. This is because
     * once a context finishes loading, we need to rerender this component and check to see
     * if all contexts have been ran.
     */
    }, [authLoading, userIsLoggedIn, user, profileContextLoading]);

    if ( loadingApplication ) {
        return <div> Loading... </div>;
    }

    return (
        <div>
            { children }
        </div>
    )
}

/**
 * The AppContextComponent contains all of the contexts that will be passed down to the current
 * rendered component. It is used at the top level of the application that wraps the react router.
 * 
 * It is also responsible for displaying the loading page while setting up the application such as
 * dealing with authentication and fetching the authenticated users profile information.
 */
export const AppContextComponent: React.FC<Props> = ({ children }) => {
    return (
        <AuthContextComponent>
            <ProfileContextComponent>
                <App>
                    { children }
                </App>
            </ProfileContextComponent>
        </AuthContextComponent>
    )
}

export default AppContextComponent;