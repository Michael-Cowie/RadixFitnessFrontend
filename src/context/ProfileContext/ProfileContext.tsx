import useAuthContext from 'context/AuthContext/AuthContext';
import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, saveProfile } from 'services/Profile/Profile';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

import {
  defaultMeasurementSystem,
  Profile,
  Props
} from './ProfileContextInterfaces';

const ProfileContext = createContext<Profile>({
  loading: true,
  updateProfileContext: () => null,
  createAndSaveProfile: async () => false,
  name: '',
  measurementSystem: defaultMeasurementSystem,
  hasProfile: false
});

export const ProfileContextComponent: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>(
    defaultMeasurementSystem
  );
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  const { loading: authLoading, userIsLoggedIn, user } = useAuthContext();

  useEffect(() => {
    if (!authLoading && !userIsLoggedIn) {
      setName('');
      setMeasurementSystem(defaultMeasurementSystem);
      setHasProfile(false);
    }

    if (authLoading || !userIsLoggedIn) return;

    setLoading(true);

    getProfile()
      .then((data) => {
        setName(data.name);
        setMeasurementSystem(data.measurement_system);
        setHasProfile(true);
      })
      .catch(() => {
        setHasProfile(false);
      })
      .finally(() => setLoading(false));
  }, [authLoading, userIsLoggedIn, user]);

  function updateProfileContext(
    name: string,
    measurementSystem: MeasurementSystem,
    hasProfile: boolean
  ) {
    setName(name);
    setMeasurementSystem(measurementSystem);
    setHasProfile(hasProfile);
  }

  async function createAndSaveProfile(
    name: string,
    system: MeasurementSystem
  ): Promise<boolean> {
    const success = await saveProfile(name, system);
    if (success) {
      updateProfileContext(name, system, true);
    }
    return success;
  }

  return (
    <ProfileContext.Provider
      value={{
        loading,
        updateProfileContext,
        createAndSaveProfile,
        name,
        measurementSystem,
        hasProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

const useProfileContext = () => {
  return useContext(ProfileContext);
};

export default useProfileContext;
