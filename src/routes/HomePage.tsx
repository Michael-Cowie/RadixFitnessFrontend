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
                    <RouterButton button_text="Track my Weight" route="/weight_tracking"/>
                    <RouterButton button_text="Nutrient Intake" route="/food_intake_tracking"/>
                    <button className="btn mt-4 mb-4 w-full" disabled> Exercise Finder </button>
                    <button className="btn mt-4 mb-4 w-full" disabled> Education </button>
                </EqualWidthContainer>
            </CenterContainer>
        </PageTemplate> 
    );
}

export default HomePage;
