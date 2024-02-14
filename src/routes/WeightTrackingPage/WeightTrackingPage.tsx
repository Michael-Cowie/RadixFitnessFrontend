import CenterContainer from 'atoms/CenterContainer';
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
import styled from 'styled-components';
import PageTemplate from 'templates/PageTemplate';

import { createDisplayText } from './WeightTrackingPageAlgorithms';
import { DateToUserData, DateToWeight } from './WeightTrackingPageInterfaces';

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
            'weight_kg': userWeightEntry.weight_kg,
            'notes': userWeightEntry.notes
          }
        }

        setDateToUserData(dateToUserData);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  function onSuccess(date:string, weight: string, notes:string) {
    dateToUserData[date] = {
      'weight_kg': weight,
      'notes': notes
    };
    setDateToUserData(dateToUserData);
    setCreateWeight(false);
  }

  return (
      <PageTemplate>
          <CenterContainer>
              { createWeight && 
                <EditUpdateWeight 
                  displayUnit={ displayUnit } 
                  onSuccess={ onSuccess  }
                  closeModalWindow={ () => setCreateWeight(false) }
                  dateData={ dateToUserData }
                />
              }
              <WeightTrackingLineGraph
                displayUnit={ displayUnit } 
                dateRange={ selectedDateRange }
                dateToUserData={ dateToUserData }
                trendLineEnabled= { trendLineEnabled }
              />

              <ImageContainer>
                <img alt="Github" src="add_weight_icon.png" onClick={() => setCreateWeight(true)}/>
              </ImageContainer>

              <div className="mt-2">
                <span className="label-text mr-2 font-bold"> Enable trendline</span>
                <input 
                  className="focus:ring-0"
                  type="checkbox"
                  checked={ trendLineEnabled }
                  onChange={ () => setTrendLineEnabled(!trendLineEnabled )}
                />
              </div>

              <RowAlignmentContainer>
                {dataSelectionRange.map((dateRange, i) => (
                  <SelectableButton 
                    selected={ dateRange === selectedDateRange } 
                    displayText={ createDisplayText(dateRange) }
                    onClick={ () => setSelectedDateRange(dateRange) }
                    key={ i }
                  />
                ))}
              </RowAlignmentContainer>

              <RowAlignmentContainer>
                {availableUnits.map((unit, i) => (
                  <SelectableButton 
                    selected={ unit === displayUnit } 
                    displayText={ unit }
                    onClick={ () => setDisplayUnit(unit) }
                    key={ i }
                  />
                ))}
              </RowAlignmentContainer>
          </CenterContainer>
      </PageTemplate>
  )
}

const RowAlignmentContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
`

const ImageContainer = styled.div`
  height: 50px;
  width: 50px;
  cursor: pointer;
`

export default WeightTrackingPage;
