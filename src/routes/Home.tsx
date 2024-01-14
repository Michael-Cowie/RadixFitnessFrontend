import CreateProfile from "molecules/CreateProfile";
import { useEffect, useState } from "react";
import { getProfile } from "services/Profile";

const Home = () => {
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
        <div>
            <h1> You are logged into the home page! </h1>;
            { createProfile && <CreateProfile/> }
        </div> 
    );
}

export default Home;
