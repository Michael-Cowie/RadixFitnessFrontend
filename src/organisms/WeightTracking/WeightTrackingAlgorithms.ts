import {
    findFurtherestDate, findLatestDate, formattedDateWithOffset, formattedDateWithOffsetFrom,
    removeYearFromDate
} from 'lib/dateUtils';
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

export function plottingData(dateToWeight: DateToWeight, dateRange: number, unit: AvailableWeightUnits): [string[], (string | null)[]] {
    const minimumFutureDays = 1;
    const minimumNumberDays = 7;

    const data: (string | null)[] = [];
    const labels: string[] = [];

    const addDataPoint = (formattedDate: string): void => {
        data.push(formattedDate in dateToWeight ? convertKgTo(unit, dateToWeight[formattedDate]) : null);
        labels.push(removeYearFromDate(formattedDate));
    };

    if (dateRange === Infinity) {
        const datesWithWeight: string[] = Object.keys(dateToWeight);

        if (datesWithWeight.length === 0) {
            for (let dateOffset = -minimumNumberDays; dateOffset <= 0; dateOffset++) {
              addDataPoint(formattedDateWithOffset(dateOffset));
            }
        } else {
            let furtherestDate = findFurtherestDate(datesWithWeight);
            let closestDate = findLatestDate(datesWithWeight);
            let currentOffset = 0;
            
            addDataPoint(formattedDateWithOffsetFrom(furtherestDate, currentOffset));

            while (formattedDateWithOffsetFrom(furtherestDate, currentOffset) !== closestDate) {
                currentOffset += 1;
                addDataPoint(formattedDateWithOffsetFrom(furtherestDate, currentOffset));
            }
        }
    } else {
        for (let dateOffset = -dateRange; dateOffset <= minimumFutureDays; dateOffset++) {
            addDataPoint(formattedDateWithOffset(dateOffset));
        }
    }

    return [labels, data];
}
