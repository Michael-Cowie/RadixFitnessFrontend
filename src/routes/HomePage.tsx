import CenterContainer from 'atoms/CenterContainer';
import EqualWidthContainer from 'atoms/EqualWidthContainer';
import RouterButton from 'atoms/RouterButton';
import styles from 'lib/colours.module.css';
import CreateProfile from 'molecules/UserProfile/CreateProfile';
import { useEffect, useState } from 'react';
import { getProfile } from 'services/Profile';
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
                    <button className={ `btn ${ styles.blueWithHover } mt-4 mb-4 w-full` }> W̶o̶r̶k̶o̶u̶t̶  </button>
                    <button className={ `btn ${ styles.blueWithHover } mt-4 mb-4 w-full` }> E̶x̶e̶r̶c̶i̶s̶e̶ f̶i̶n̶d̶e̶r̶  </button>
                    <RouterButton button_text="Track my weight" route="/weight_tracking"/>
                    <button className={ `btn ${ styles.blueWithHover } mt-4 mb-4 w-full` }> F̶o̶o̶d̶ a̶n̶a̶l̶y̶s̶i̶s̶  </button>
                    <button className={ `btn ${ styles.blueWithHover } mt-4 mb-4 w-full` }> E̶d̶u̶c̶a̶t̶i̶o̶n̶  </button>
                </EqualWidthContainer>
            </CenterContainer>
        </PageTemplate> 
    );
}

export default HomePage;
