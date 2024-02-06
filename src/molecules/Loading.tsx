
import useAuthContext from 'context/AuthContext';
import useProfileContext, { ProfileContextComponent } from 'context/ProfileContext';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode
}

const Loading: React.FC = () => {
    return (
        <div> Loading... </div>
    )
}

const AuthenticatedLoadingComponent: React.FC<Props> = ({ children }) => {
    /**
     * A list of contexts which require authenticated requests.
     */
    const profileContext = useProfileContext();

    const isLoading = profileContext.loading;
    if (isLoading) {
        return <Loading/>
    }

    return (
        <div>
            { children }
        </div>
    )
}

export const LoadingComponent: React.FC<Props> = ({ children }) => {
    const authContext = useAuthContext();
    
    if (authContext.loading) {
        return <Loading/>
    }

    /**
     * Once the user has logged in, then execute the contexts which require user authenticaticated requests.
     */
    return (
        <ProfileContextComponent>
            <AuthenticatedLoadingComponent>
                { children }
            </AuthenticatedLoadingComponent>
        </ProfileContextComponent>
    )
}

export default LoadingComponent;