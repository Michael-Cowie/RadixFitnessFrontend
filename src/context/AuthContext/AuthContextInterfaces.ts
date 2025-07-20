import { User } from 'firebase/auth';
import { ReactNode } from 'react';

export interface AuthProviderContextData {
  loading: boolean;
  user: User | null;
  userIsLoggedIn: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
}

export interface Props {
  children: ReactNode;
}
