import { ReactNode } from 'react';
import { User } from 'firebase/auth'


export interface AuthProviderContextData {
    user: User | null,
    userIsLoggedIn: boolean,
    loginUser: (email: string, password: string) => Promise<boolean>,
    signOutUser: () => Promise<void>
}

export interface Props {
    children: ReactNode;
}