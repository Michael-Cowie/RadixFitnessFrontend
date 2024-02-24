import {
    WeightTrackingGraphContextComponent
} from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import EditUpdateWeight from 'molecules/EditUpdateWeight/editUpdateWeight';
import WeightGraphSettings from 'molecules/WeightGraphSettings/WeightGraphSettings';
import WeightTrackingDateRangeSelection from 'organisms/WeightTracking/WeightTrackingDateRangeSelection';
import WeightTrackingLineGraph from 'organisms/WeightTracking/WeightTrackingLineGraph';
import { useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import PageTemplate from 'templates/PageTemplate';

import styles from './WeightTracking.module.css';

const WeightTrackingPage = () => {
  const [useConfetti, setUseConfetti] = useState(false);

  const [createWeight, setCreateWeight] = useState<boolean>(false);
  const [createGoalWeight, setCreateGoalWeight] = useState<boolean>(false);

  const { width, height } = useWindowSize();

  return (
    <PageTemplate>
      <WeightTrackingGraphContextComponent>
        {/* This is a modal popup and will appear when createWeight is true. */}
        { createWeight && 
          <EditUpdateWeight 
            closeModalWindow={ () => {
              setCreateWeight(false);
              setUseConfetti(true);
            }}
          />
        }

        {/* This is a modal popup and will appear when settingsOpen is true. */}
        { createGoalWeight && <WeightGraphSettings closeModalWindow={ () => setCreateGoalWeight(false) }/> }

        { /* This component will make confetti appear and then slowly fade. */}
        { useConfetti && <Confetti className={ `${ styles.fadeOut }` } width={width} height={height}/> }
        
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="w-full md:w-3/6 p-3">
              <WeightTrackingLineGraph/>
            </div>

            <div className="w-full flex justify-center flex-row">
                <div className="h-8 w-8 md:h-9 md:w-9 mr-5">
                  <img title="Add an entry" src="add_weight_icon.png" onClick={ () => setCreateWeight(true) }/>
                </div>

                <div className="h-8 w-8 md:h-9 md:w-9">
                  <img title="Settings" src="settings_cogwheel.svg" onClick={ () => setCreateGoalWeight(true) }/>
                </div>
            </div>
          <WeightTrackingDateRangeSelection/>
        </div>
      </WeightTrackingGraphContextComponent>
    </PageTemplate>
  )
}


export default WeightTrackingPage;
