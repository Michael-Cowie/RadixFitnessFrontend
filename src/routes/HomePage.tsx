import CenterContainer from 'atoms/CenterContainer';
import EqualWidthContainer from 'atoms/EqualWidthContainer';
import RouterButton from 'atoms/RouterButton';
import PageTemplate from 'templates/PageTemplate';

const HomePage = () => {
    return (
        <PageTemplate>
            <CenterContainer>
                <EqualWidthContainer width="15%">
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
