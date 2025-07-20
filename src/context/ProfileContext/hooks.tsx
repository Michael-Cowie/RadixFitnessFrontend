import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';

const useProfileContext = () => {
  return useContext(ProfileContext);
};

export default useProfileContext;
