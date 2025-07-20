import { AuthContextComponent } from 'context/AuthContext/AuthContext';
import React, { ReactNode } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ProfileContextComponent } from './ProfileContext/ProfileContext';

interface Props {
  children: ReactNode;
}

export const AppContextComponent: React.FC<Props> = ({ children }) => {
  return (
    <AuthContextComponent>
      <ProfileContextComponent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
      </ProfileContextComponent>
    </AuthContextComponent>
  );
};

export default AppContextComponent;
