import { User } from 'firebase/auth';
import { ReactNode } from 'react';

export interface AuthProviderContextData {
    user: User | null,
    userIsLoggedIn: boolean,
    loginUser: (email: string, password: string) => Promise<boolean>,
    signOutUser: () => Promise<void>
}

export interface Props {
    children: ReactNode;
}