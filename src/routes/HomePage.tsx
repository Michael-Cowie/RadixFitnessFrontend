import CenterContainer from 'atoms/CenterContainer';
import EqualWidthContainer from 'atoms/EqualWidthContainer';
import RouterButton from 'atoms/RouterButton';
import CreateProfile from 'molecules/UserProfile/CreateProfile';
import { useEffect, useState } from 'react';
import { getProfile } from 'services/Profile/Profile';
import PageTemplate from 'templates/PageTemplate';

const HomePage = () => {
    const [createProfile, setCreateProfile] = useState<boolean>(false);
 
    useEffect(() => {
        getProfile()
            .then((profile => {
                setCreateProfile(profile === null);
            }))
            .catch(_error => {
                setCreateProfile(true);
            })
    }, []);

    return (
        <PageTemplate>
            { createProfile && <CreateProfile/> }
            <CenterContainer>
                <EqualWidthContainer>
                    <RouterButton button_text="Track my weight" route="/weight_tracking"/>
                    <button className="btn mt-4 mb-4 w-full" disabled> Exercise Finder </button>
                    <button className="btn mt-4 mb-4 w-full" disabled> Workout </button>
                    <button className="btn mt-4 mb-4 w-full" disabled> Food Analysis </button>
                    <button className="btn mt-4 mb-4 w-full" disabled> Education </button>
                </EqualWidthContainer>
            </CenterContainer>
        </PageTemplate> 
    );
}

export default HomePage;
