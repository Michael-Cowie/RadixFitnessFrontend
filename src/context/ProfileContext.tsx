import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getProfile } from 'services/Profile';

interface Profile {
    loading: boolean,
    updateProfileContext: (name: string, preferredUnit: string) => void;
    name: string,
    preferredUnit: string
}

export interface Props {
    children: ReactNode;
}

const ProfileContext = createContext<Profile>({
    loading: true,
    updateProfileContext: () => null,
    name: "",
    preferredUnit: ""
});

export const ProfileContextComponent: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [preferredUnit, setPreferredUnit] = useState('');

    useEffect(() => {
        getProfile()
            .then(data => {
                setName(data.name);
                setPreferredUnit(data.preferred_unit);
            })
            .catch(error => {
                console.log(error);
                
            })
            .finally(() => setLoading(false));
        
    }, []) // Pass an array, so that that is called when we have been added to the DOM (first render) and not each re-render.

    function updateProfileContext(name: string, preferredUnit: string) {
        setName(name);
        setPreferredUnit(preferredUnit);
    }

    return (
        <ProfileContext.Provider value={ { loading, updateProfileContext, name, preferredUnit } } >
            { children }
        </ProfileContext.Provider>
    )
}

const useProfileContext = () => {
    return useContext(ProfileContext);
}

export default useProfileContext;
