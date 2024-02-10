import { MMDDFormattedDate, YYYYMMDDFormattedDate } from 'lib/utils';
import { DateToWeight } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { convertKgTo } from 'services/WeightTracking/utils';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

import { ToolTip } from './WeightTrackingInterfaces';

export function determine_tooltip(displayUnit: AvailableWeightUnits){
    function inner(tooltipItem: ToolTip) {
        const label = tooltipItem.label;
        const weight_kg = tooltipItem.raw;
    
        return `On ${label}, you weighed ${weight_kg}${displayUnit}!`;
    }
    return inner;
}

function findFurtherestDate(dateStrings: string[]): string {
    const sortedDates = dateStrings.sort();
    const latestDate = sortedDates[0];

    return latestDate;
}

export function plottingData(initialData: DateToWeight, dateRange: number, unit: AvailableWeightUnits): [string[], (string | null)[]] {
    const minimum_future_days = 2;
    const minimum_number_days = 7;
  
    let data: (string | null)[] = [];
    let labels: string[] = [];
     
    if (dateRange === Infinity) {
      const datesWithWeight: string[] = Object.keys(initialData);
      if (datesWithWeight.length == 0) {
        for (let dateOffset = -minimum_number_days; dateOffset <= minimum_future_days; dateOffset++){
          data.push(null);
          labels.push(MMDDFormattedDate(dateOffset))
        }
      } else {
        let furtherestDate = findFurtherestDate(datesWithWeight);
        let currentOffset = 0;
        let formattedDate = YYYYMMDDFormattedDate(currentOffset);
  
        /**
         * Initial check if we have a weight for today.
         */
        data.unshift(formattedDate in initialData ? convertKgTo(unit, initialData[formattedDate]) : null);
        labels.push(MMDDFormattedDate(currentOffset))
  
        /**
         * Continually iterate from Today until the furtherest date.
         */
        while (formattedDate !== furtherestDate) {
          currentOffset -= 1;
          formattedDate = YYYYMMDDFormattedDate(currentOffset);
  
          data.unshift(formattedDate in initialData ? convertKgTo(unit, initialData[formattedDate]) : null);
          labels.unshift(MMDDFormattedDate(currentOffset));
        }
      }
    } else {
      for (let dateOffset = -dateRange; dateOffset <= minimum_future_days; dateOffset++){
        const dateLabel = YYYYMMDDFormattedDate(dateOffset);
  
        data.push(dateLabel in initialData ? convertKgTo(unit, initialData[dateLabel]) : null);
        labels.push(MMDDFormattedDate(dateOffset))
      }
    }
    return [labels, data];
}
