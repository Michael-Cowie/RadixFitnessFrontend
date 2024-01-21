import styled from "styled-components";
import EqualWidthContainer from "atoms/EqualWidthContainer";

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
                <EqualWidthContainer>
                    <button className="btn btn-active btn-neutral mt-4 mb-4 w-full"> Workout </button>
                    <RouterButton button_text="Track my weight" route="/weight_tracking"/>
                    <button className="btn btn-active btn-neutral mt-4 mb-4 w-full"> Food analysis </button>
                    <button className="btn btn-active btn-neutral mt-4 mb-4 w-full"> Education </button>
                </EqualWidthContainer>
            </CenterContainer>
        </PageTemplate> 
    );
}

export default HomePage;
