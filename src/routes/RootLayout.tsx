import AppContextComponent from 'context/AppContext';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <AppContextComponent>
      <Outlet />
    </AppContextComponent>
  );
};

export default RootLayout;
