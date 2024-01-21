import CenterContainer from "atoms/CenterContainer";
import CreateProfile from "molecules/CreateProfile";
import PageTemplate from "templates/PageTemplate";
import { useEffect, useState } from "react";
import { getProfile } from "services/Profile";
import RouterButton from "atoms/RouterButton";

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
                <button className="btn btn-active btn-neutral mt-4 mb-4"> Workout </button>
                <RouterButton button_text="Track my weight" route="/weight_tracking"/>
                <button className="btn btn-active btn-neutral mt-4 mb-4"> Food analysis </button>
                <button className="btn btn-active btn-neutral mt-4 mb-4"> Education </button>
            </CenterContainer>
        </PageTemplate> 
    );
}

export default HomePage;
