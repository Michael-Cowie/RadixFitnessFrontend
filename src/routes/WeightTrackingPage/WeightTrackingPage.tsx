import SelectableButton from 'atoms/SelectableButton';
import useProfileContext from 'context/ProfileContext';
import dayjs, { Dayjs } from 'dayjs';
import { weightOnClosestDateTo } from 'lib/dateUtils';
import EditUpdateWeight from 'molecules/EditUpdateWeight/editUpdateWeight';
import WeightGraphSettings from 'molecules/WeightGraphSettings/WeightGraphSettings';
import { SettingsChanged } from 'molecules/WeightGraphSettings/WeightGraphSettingsInterfaces';
import WeightTrackingLineGraph from 'organisms/WeightTracking/WeightTrackingLineGraph';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { WeightGoal } from 'services/WeightGoal/goalWeightOnDateInterface';
import { getGoalWeightOnDate } from 'services/WeightGoal/goalWeightOnDateService';
import { measurementSystemToUnit } from 'services/WeightTracking/utils';
import { getAllWeights } from 'services/WeightTracking/WeightTracking';
import {
    AvailableWeightUnits, WeightEntry
} from 'services/WeightTracking/WeightTrackingInterfaces';
import PageTemplate from 'templates/PageTemplate';

import styles from './WeightTracking.module.css';
import { createDisplayText } from './WeightTrackingPageAlgorithms';
import { DateToUserData } from './WeightTrackingPageInterfaces';

const dataSelectionRange = [7, 14, 30, 90, Infinity];

const WeightTrackingPage = () => {
  const { measurementSystem } = useProfileContext();

  const [dateToUserData, setDateToUserData] = useState<DateToUserData>({});
  const [createWeight, setCreateWeight] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [displayUnit, setDisplayUnit] = useState<AvailableWeightUnits>(measurementSystemToUnit(measurementSystem));
  const [selectedDateRange, setSelectedDateRange] = useState<number>(7);
  const [trendLineEnabled, setTrendLineEnabled] = useState(true);
  const [useConfetti, setUseConfetti] = useState(false);

  const [goalDate, setGoalDate] = useState<Dayjs>(dayjs(new Date()).add(7, 'days'));
  const [goalWeight, setGoalWeight] = useState<number>(70);
  const [enableGoalWeightPrediction, setEnableGoalWeightPrediction] = useState<boolean>(true);

  useEffect(() => {
    setDisplayUnit(measurementSystemToUnit(measurementSystem));
  }, [measurementSystemToUnit(measurementSystem)])

  useEffect(() => {
    getAllWeights()
      .then((responseData: WeightEntry[]) => {
        let dateToUserData: DateToUserData = {};

        for (let userWeightEntry of responseData) {
          dateToUserData[userWeightEntry.date] = {
            'weight_kg': parseFloat(userWeightEntry.weight_kg),
            'notes': userWeightEntry.notes
          }
        }

        setDateToUserData(dateToUserData);
      })
      .catch(error => {
        console.log(error);
      })
    
    getGoalWeightOnDate()
      .then((responseData: WeightGoal | null) => {
        if (responseData) {
          setGoalDate(responseData.goalDate);
          setGoalWeight(responseData.goalWeightKg);
        }
      });
    
    
  }, [])

  function onEditUpdateSuccess(date:string, weight_kg: number, notes:string) {
    dateToUserData[date] = {
      'weight_kg': weight_kg,
      'notes': notes
    };
    setDateToUserData(dateToUserData);
    setCreateWeight(false);

    if ((weight_kg - weightOnClosestDateTo(dateToUserData, date)) <= 0) {
      setUseConfetti(true);

      setTimeout(() => {
        setUseConfetti(false);
      }, 4000);
    }
  }

  function onSettingsSuccess({enableTrendline, displayUnit, enableGoalSettings, goalDate, goalWeight, enableWeightPredicion}: SettingsChanged) {
    setTrendLineEnabled(enableTrendline)
    setDisplayUnit(displayUnit)

    setSettingsOpen(false);
  }

  const { width, height } = useWindowSize()
  return (
    <PageTemplate>
      {/* This is a modal popup and will appear when createWeight is true. */}
      { createWeight && 
        <EditUpdateWeight 
          displayUnit={ displayUnit } 
          onSuccess={ onEditUpdateSuccess  }
          closeModalWindow={ () => setCreateWeight(false) }
          dateData={ dateToUserData }
        />
      }

      {/* This is a modal popup and will appear when settingsOpen is true. */}
      { settingsOpen && 
        <WeightGraphSettings 
          displayUnit={ displayUnit } 
          onSuccess={ onSettingsSuccess }
          closeModalWindow={ () => setSettingsOpen(false) }
        />
      }

      { /* This component will make confetti appear and then slowly fade. */}
      { useConfetti && <Confetti className={ `${ styles.fadeOut }` } width={width} height={height}/> }
      
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="w-full md:w-3/6 p-3">
          <WeightTrackingLineGraph
            displayUnit={ displayUnit } 
            dateRange={ selectedDateRange }
            dateToUserData={ dateToUserData }
            trendLineEnabled= { trendLineEnabled }
            goalInformation={{
              goalDate: goalDate,
              goalWeight: goalWeight,
              enablePrediction: enableGoalWeightPrediction
            }}
          />
        </div>

        <div className="w-full flex justify-center flex-row">
            <div className="h-8 w-8 md:h-9 md:w-9 mr-5">
              <img title="Add an entry" src="add_weight_icon.png" onClick={ () => setCreateWeight(true) }/>
            </div>

            <div className="h-8 w-8 md:h-9 md:w-9">
              <img title="Settings" src="settings_cogwheel.svg" onClick={ () => setSettingsOpen(true) }/>
            </div>
        </div>

        <div className="mt-3 w-full flex justify-center font-bold">
          <h1> Select a range </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="mt-2 w-full flex flex-row justify-center items-center">
            { dataSelectionRange.slice(0, 3).map((dateRange, i) => (
              <SelectableButton 
                selected={ dateRange === selectedDateRange } 
                displayText={ createDisplayText(dateRange) }
                onClick={ () => setSelectedDateRange(dateRange) }
                key={ i }
              />
            )) }
          </div>

          <div className="mt-3 w-full flex flex-row justify-center items-center">
            { dataSelectionRange.slice(3, 6).map((dateRange, i) => (
                <SelectableButton 
                  selected={ dateRange === selectedDateRange } 
                  displayText={ createDisplayText(dateRange) }
                  onClick={ () => setSelectedDateRange(dateRange) }
                  key={ i }
                />
              )) }
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}


export default WeightTrackingPage;
