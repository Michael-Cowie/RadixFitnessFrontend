import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/hooks';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const WeightTrackingPageLoadingHandler: React.FC<Props> = ({ children }) => {
  const {
    ui: { isLoading },
  } = useWeightTrackingGraphContext();

  if (isLoading) {
    return (
      <>
        <div className="w-5/6 md:w-1/6">
          <SubmitButtonWithProgress buttonText="" displayLoadingAnimation={true} />
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default WeightTrackingPageLoadingHandler;
