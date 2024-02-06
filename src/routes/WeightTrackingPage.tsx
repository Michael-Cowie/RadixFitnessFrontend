import CenterContainer from 'atoms/CenterContainer';
import SelectableButton from 'atoms/SelectableButton';
import useProfileContext from 'context/ProfileContext';
import { findLatestDate } from 'lib/utils';
import CreateWeight from 'molecules/CreateWeight';
import WeightTrackingLineGraph from 'organisms/WeightTrackingLineGraph';
import { useEffect, useState } from 'react';
import { WeightEntry } from 'services/api_interface';
import { getAllWeights } from 'services/WeightTracking';
import styled from 'styled-components';
import PageTemplate from 'templates/PageTemplate';

export type DateToWeight = Record<string, string>

const today: string = new Date().toISOString().slice(0, 10);
const availableUnits = ['kg', 'lbs'];
const dataSelectionRange = [7, 14, 30, 90, Infinity];

function createDisplayText(range: number): string {
  if (range === Infinity) return "All days";
  return `${range} days`;
}

function getDefaultValue(existingWeight: DateToWeight): string {
  if (Object.keys(existingWeight).length == 0){
    const averagePersonWeightKg = '65';
    return averagePersonWeightKg;
  } else {
    const latestEntry = findLatestDate(Object.keys(existingWeight));
    return existingWeight[latestEntry];
  }
}

const WeightTrackingPage = () => {
  const { preferredUnit } = useProfileContext();

  let [dateData, setDateData] = useState<DateToWeight>({});
  let [createWeight, setCreateWeight] = useState<boolean>(false);
  let [displayUnit, setDisplayUnit] = useState<string>("kg");
  let [selectedDateRange, setSelectedDateRange] = useState<number>(7);

  useEffect(() => {
    getAllWeights()
      .then((responseData: WeightEntry[]) => {
        let dateToWeight: DateToWeight = {};
        for (let userWeightEntry of responseData) {
          dateToWeight[userWeightEntry.date] = userWeightEntry.weight_kg;
        }
        setDateData(dateToWeight);
        if (preferredUnit === "Metric") {
          setDisplayUnit("kg");
        } else if (preferredUnit === "Imperial") {
          setDisplayUnit("lbs");
        }
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
              />

              <ImageContainer>
                <img alt="Github" src="add_weight_icon.png" onClick={() => setCreateWeight(true)}/>
              </ImageContainer>

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