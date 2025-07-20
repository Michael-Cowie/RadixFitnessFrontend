import AddEntry from 'atoms/addEntry';
import { WeightTrackingGraphContextComponent } from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import EditUpdateWeight from 'molecules/EditUpdateWeight/editUpdateWeight';
import WeightGraphSettings from 'molecules/WeightGraphSettings/WeightGraphSettings';
import WeightTrackingDateRangeSelection from 'organisms/WeightTracking/WeightTrackingDateRangeSelection';
import WeightTrackingLineGraph from 'organisms/WeightTracking/WeightTrackingLineGraph';
import { useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import PageTemplate from 'templates/PageTemplate';

import styles from './WeightTracking.module.css';
import WeightTrackingPageLoadingHandler from './WeightTrackingPageLoadingHandler';

const WeightTrackingPage = () => {
  const [useConfetti, setUseConfetti] = useState(false);

  const [createWeight, setCreateWeight] = useState<boolean>(false);
  const [createGoalWeight, setCreateGoalWeight] = useState<boolean>(false);

  const { width, height } = useWindowSize();

  return (
    <PageTemplate>
      <WeightTrackingGraphContextComponent>
        {/* This is a modal popup and will appear when createWeight is true. */}
        {createWeight && (
          <EditUpdateWeight
            closeModalWindow={(showConfetti) => {
              setCreateWeight(false);
              setUseConfetti(showConfetti); // After opacity is zero, reset is to false.

              setTimeout(() => {
                setUseConfetti(false); // Reset it, after opacity fades it to zero.
              }, 4000);
            }}
          />
        )}

        {/* This is a modal popup and will appear when settingsOpen is true. */}
        {createGoalWeight && (
          <WeightGraphSettings closeModalWindow={() => setCreateGoalWeight(false)} />
        )}

        {/* This component will make confetti appear and then slowly fade. */}
        {useConfetti && <Confetti className={`${styles.fadeOut}`} width={width} height={height} />}

        <div className="h-screen w-screen flex flex-col justify-center items-center">
          <div className="w-full h-3/6 md:w-3/6 p-3">
            <WeightTrackingLineGraph />
          </div>

          <WeightTrackingPageLoadingHandler>
            <div className="w-full flex justify-center flex-row">
              <div className="mr-5 h-9 w-9">
                <AddEntry onClick={() => setCreateWeight(true)} />
              </div>

              <div className="h-8 w-8 md:h-9 md:w-9">
                <img
                  title="Settings"
                  src="/settings_cogwheel.svg"
                  onClick={() => setCreateGoalWeight(true)}
                />
              </div>
            </div>

            <WeightTrackingDateRangeSelection />
          </WeightTrackingPageLoadingHandler>
        </div>
      </WeightTrackingGraphContextComponent>
    </PageTemplate>
  );
};

export default WeightTrackingPage;
