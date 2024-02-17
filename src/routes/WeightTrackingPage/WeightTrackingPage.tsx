import SelectableButton from 'atoms/SelectableButton';
import useProfileContext from 'context/ProfileContext';
import EditUpdateWeight from 'molecules/EditUpdateWeight/editUpdateWeight';
import WeightTrackingLineGraph from 'organisms/WeightTracking/WeightTrackingLineGraph';
import { useEffect, useState } from 'react';
import { measurementSystemToUnit } from 'services/WeightTracking/utils';
import { getAllWeights } from 'services/WeightTracking/WeightTracking';
import {
    AvailableWeightUnits, WeightEntry
} from 'services/WeightTracking/WeightTrackingInterfaces';
import PageTemplate from 'templates/PageTemplate';

import { createDisplayText } from './WeightTrackingPageAlgorithms';
import { DateToUserData } from './WeightTrackingPageInterfaces';

const availableUnits: AvailableWeightUnits[] = ['kg', 'lbs'];
const dataSelectionRange = [7, 14, 30, 90, Infinity];

const WeightTrackingPage = () => {
  const { measurementSystem } = useProfileContext();

  const [dateToUserData, setDateToUserData] = useState<DateToUserData>({});
  const [createWeight, setCreateWeight] = useState<boolean>(false);
  const [displayUnit, setDisplayUnit] = useState<AvailableWeightUnits>(measurementSystemToUnit(measurementSystem));
  const [selectedDateRange, setSelectedDateRange] = useState<number>(7);
  const [trendLineEnabled, setTrendLineEnabled] = useState(true);

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
  }, [])

  function onSuccess(date:string, weight_kg: number, notes:string) {
    dateToUserData[date] = {
      'weight_kg': weight_kg,
      'notes': notes
    };
    setDateToUserData(dateToUserData);
    setCreateWeight(false);
  }

  
  return (
    <PageTemplate>
      {/* This is a modal popup and will appear when createWeight is true. */}
      { createWeight && 
        <EditUpdateWeight 
          displayUnit={ displayUnit } 
          onSuccess={ onSuccess  }
          closeModalWindow={ () => setCreateWeight(false) }
          dateData={ dateToUserData }
        />
      }
      
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="w-full md:w-4/6 p-3">
          <WeightTrackingLineGraph
            displayUnit={ displayUnit } 
            dateRange={ selectedDateRange }
            dateToUserData={ dateToUserData }
            trendLineEnabled= { trendLineEnabled }
          />
        </div>

        <div className="w-full flex justify-center">
            <div className="h-8 w-8 md:h-9 md:w-9">
              <img alt="Github" src="add_weight_icon.png" onClick={ () => setCreateWeight(true) }/>
            </div>
        </div>

        <div className="mt-3 w-full flex justify-center font-bold">
          <h1> Select a range </h1>
        </div>

        <div className="flex flex-col">
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

        <div className="mt-3 w-full flex justify-center font-bold">
          <h1> Select a display unit </h1>
        </div>

        <div className="mt-3 w-full flex justify-center">
          { availableUnits.map((unit, i) => (
            <SelectableButton 
              selected={ unit === displayUnit } 
              displayText={ unit }
              onClick={ () => setDisplayUnit(unit) }
              key={ i }
            />
          )) }
        </div>

        <div className="mt-3 w-full flex justify-center">
          <span className="label-text mr-2 font-bold"> Enable trendline</span>
          <input 
            className="focus:ring-0"
            type="checkbox"
            checked={ trendLineEnabled }
            onChange={ () => setTrendLineEnabled(!trendLineEnabled )}
          />
        </div>
      </div>
    </PageTemplate>
  )
}


export default WeightTrackingPage;
