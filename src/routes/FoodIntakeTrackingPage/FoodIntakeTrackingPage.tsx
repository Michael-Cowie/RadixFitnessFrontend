import CenterContainer from 'atoms/CenterContainer';
import {
    FoodIntakeTrackingContextComponent
} from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import DailyMacroNutrientProgress from 'molecules/FoodIntakeTracking/DailyMacroNutrientProgress';
import DateSelection from 'molecules/FoodIntakeTracking/DateSelection';
import PageTemplate from 'templates/PageTemplate';

const FoodIntakeTrackingPage = () => {
    return (
        <PageTemplate>
            <FoodIntakeTrackingContextComponent>
                <CenterContainer>
                    <div className="w-full p-2 md:p-0 md:w-8/12 lg:w-3/12">
                        <DateSelection/>
                        <DailyMacroNutrientProgress/>
                    </div>
                </CenterContainer>
            </FoodIntakeTrackingContextComponent>
        </PageTemplate>
    )
}



export default FoodIntakeTrackingPage;