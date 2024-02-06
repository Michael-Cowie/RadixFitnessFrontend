import { AuthContextComponent } from 'context/AuthContext';
import LoadingComponent from 'molecules/Loading';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const AppContextComponent: React.FC<Props> = ({ children }) => {
    return (
        <AuthContextComponent>
            <LoadingComponent>
                { children }
            </LoadingComponent>
        </AuthContextComponent>
    )
}

export default AppContextComponent;