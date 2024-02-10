import CenterContainer from 'atoms/CenterContainer';
import SelectableButton from 'atoms/SelectableButton';
import useProfileContext from 'context/ProfileContext';
import CreateWeight from 'molecules/CreateWeight';
import WeightTrackingLineGraph from 'organisms/WeightTracking/WeightTrackingLineGraph';
import { useEffect, useState } from 'react';
import { measurementSystemToUnit } from 'services/WeightTracking/utils';
import { getAllWeights } from 'services/WeightTracking/WeightTracking';
import {
    AvailableWeightUnits, WeightEntry
} from 'services/WeightTracking/WeightTrackingInterfaces';
import styled from 'styled-components';
import PageTemplate from 'templates/PageTemplate';

import { createDisplayText, getDefaultValue } from './WeightTrackingPageAlgorithms';
import { DateToWeight } from './WeightTrackingPageInterfaces';

const today: string = new Date().toISOString().slice(0, 10);
const availableUnits: AvailableWeightUnits[] = ['kg', 'lbs'];
const dataSelectionRange = [7, 14, 30, 90, Infinity];

const WeightTrackingPage = () => {
  const { measurementSystem } = useProfileContext();

  const [dateData, setDateData] = useState<DateToWeight>({});
  const [createWeight, setCreateWeight] = useState<boolean>(false);
  const [displayUnit, setDisplayUnit] = useState<AvailableWeightUnits>(measurementSystemToUnit(measurementSystem));
  const [selectedDateRange, setSelectedDateRange] = useState<number>(7);
  const [trendLineEnabled, setTrendLineEnabled] = useState(true);

  useEffect(() => {
    getAllWeights()
      .then((responseData: WeightEntry[]) => {
        let dateToWeight: DateToWeight = {};
        for (let userWeightEntry of responseData) {
          dateToWeight[userWeightEntry.date] = userWeightEntry.weight_kg;
        }
        setDateData(dateToWeight);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  function onClose(weight: string) {
    dateData[today] = weight;
    setDateData(dateData);
    setCreateWeight(false);
  }

  return (
      <PageTemplate>
          <CenterContainer>
              { createWeight && 
                <CreateWeight 
                  displayUnit={ displayUnit } 
                  onClose={ onClose  }
                  today={ today }
                  updating={ today in dateData }
                  defaultValue={ getDefaultValue(dateData) }
                />
              }
              <WeightTrackingLineGraph 
                displayUnit={ displayUnit } 
                dateRange={ selectedDateRange }
                initialData={ dateData }
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
