import { FoodIntakeTrackingContextComponent } from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import DailyMacroNutrientProgress from 'molecules/FoodIntakeTracking/DailyMacroNutrientProgress';
import DateSelection from 'molecules/FoodIntakeTracking/DateSelection';
import FoodIntakeTable from 'molecules/FoodIntakeTracking/FoodIntakeTable/FoodIntakeTable';
import PageTemplate from 'templates/PageTemplate';

const FoodIntakeTrackingPage = () => {
  return (
    <PageTemplate>
      <FoodIntakeTrackingContextComponent>
        <div className="w-10/12 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 mt-3 sm:mt-0">
          <DateSelection />
          <DailyMacroNutrientProgress />
        </div>
        <div className="w-10/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-[50%]">
          <FoodIntakeTable />
        </div>
      </FoodIntakeTrackingContextComponent>
    </PageTemplate>
  );
};

export default FoodIntakeTrackingPage;
