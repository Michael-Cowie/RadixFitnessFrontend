import CenterContainer from 'atoms/design_patterns/CenterContainer';
import RouterButton from 'atoms/RouterButton';
import { FOOD_INTAKE_TRACKING_ROUTE, WEIGHT_TRACKING_ROUTE } from 'lib/routing_routes';
import PageTemplate from 'templates/PageTemplate';

const HomePage = () => {
  return (
    <PageTemplate>
      <CenterContainer>
        <div className="w-[80%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[20%]">
          <RouterButton button_text="Track My Weight" route={WEIGHT_TRACKING_ROUTE} />
          <RouterButton button_text="Nutrient Intake" route={FOOD_INTAKE_TRACKING_ROUTE} />
          <button className="btn mt-4 mb-4 w-full" disabled>
            {' '}
            Exercise Finder{' '}
          </button>
          <button className="btn mt-4 mb-4 w-full" disabled>
            {' '}
            Education{' '}
          </button>
        </div>
      </CenterContainer>
    </PageTemplate>
  );
};

export default HomePage;
