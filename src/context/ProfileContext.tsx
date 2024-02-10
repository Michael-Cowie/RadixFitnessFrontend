import useAuthContext from 'context/AuthContext';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getProfile } from 'services/Profile';
import { MeasurementSystem } from 'services/WeightTracking/WeightTrackingInterfaces';

interface Profile {
    loading: boolean,
    updateProfileContext: (name: string, measurementSystem: MeasurementSystem) => void;
    name: string,
    measurementSystem: MeasurementSystem
}

export interface Props {
    children: ReactNode;
}

const defaultMeasurementSystem = "Metric";

const ProfileContext = createContext<Profile>({
    loading: true,
    updateProfileContext: () => null,
    name: "",
    measurementSystem: defaultMeasurementSystem
});

export const ProfileContextComponent: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>(defaultMeasurementSystem);

    const {loading: authLoading, userIsLoggedIn, user } = useAuthContext();

    useEffect(() => {
        /**
         * User logs off, reset the state so that the next logged in user is not
         * using the previous users state. If the users never logs in then setting
         * the state back to the defaults will not cause a rerender as it has
         * not changed.
         */
        if (!authLoading && !userIsLoggedIn) {
            setName('');
            setMeasurementSystem(defaultMeasurementSystem);
        }

        if (!userIsLoggedIn || authLoading) return;

        setLoading(true);

        getProfile()
            .then(data => {
                setName(data.name);
                setMeasurementSystem(data.measurement_system);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => setLoading(false));
    /**
     * - authLoading is a dependency due to it being initially True and then changing to False. This change
     *   will rerun the useEffect when the user successfully authenticates such as initially logging in
     *   or refreshing the page. Potentially not required as if authLoading is True and then False, the
     *   condition where userIsLoggingIn is False and user is still null, it means the user is not authenticated
     *   and we do not want to fetch any user data anyway.
     * 
     * - userIsLoggedIn is a dependency due to when the user logs out of their account (and authLoading would
     *   be false) we want to enter here and reset the component state.
     * 
     * - user is a dependency similar to userIsLoggIn. If the user changes we want to fetch the user profile 
     *   again. Although, if the user logs off and then logs back in, the userIsLoggedIn will change from
     *   False -> True, which should rerender it. I don't plan on adding the ability to change users without
     *   logging off, so it could be unnecessary, but still included.
     */
    }, [authLoading, userIsLoggedIn, user]);

    function updateProfileContext(name: string, measurementSystem: MeasurementSystem) {
        setName(name);
        setMeasurementSystem(measurementSystem);
    }

    return (
        <ProfileContext.Provider value={ { loading, updateProfileContext, name, measurementSystem } } >
            { children }
        </ProfileContext.Provider>
    )
}

const useProfileContext = () => {
    return useContext(ProfileContext);
}

export default useProfileContext;
