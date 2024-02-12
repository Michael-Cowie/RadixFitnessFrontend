import {
    MMDDFormattedDate, YYYYMMDDDateWithOffset, YYYYMMDDFormattedDate, YYYYMMDDToMMDD
} from 'lib/utils';
import { findLatestDate } from 'routes/WeightTrackingPage/WeightTrackingPageAlgorithms';
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
    const minimumFutureDays = 1;
    const minimumNumberDays = 7;

    const data: (string | null)[] = [];
    const labels: string[] = [];

    const addDataPoint = (formattedDate: string): void => {
        data.push(formattedDate in initialData ? convertKgTo(unit, initialData[formattedDate]) : null);
        labels.push(YYYYMMDDToMMDD(formattedDate));
    };

    if (dateRange === Infinity) {
        const datesWithWeight: string[] = Object.keys(initialData);

        if (datesWithWeight.length === 0) {
            for (let dateOffset = -minimumNumberDays; dateOffset <= 0; dateOffset++) {
              addDataPoint(YYYYMMDDFormattedDate(dateOffset));
            }
        } else {
            let furtherestDate = findFurtherestDate(datesWithWeight);
            let closestDate = findLatestDate(datesWithWeight);
            let currentOffset = 0;
            
            addDataPoint(YYYYMMDDDateWithOffset(furtherestDate, currentOffset));

            while (YYYYMMDDDateWithOffset(furtherestDate, currentOffset) !== closestDate) {
                currentOffset += 1;
                addDataPoint(YYYYMMDDDateWithOffset(furtherestDate, currentOffset));
            }
        }
    } else {
        for (let dateOffset = -dateRange; dateOffset <= minimumFutureDays; dateOffset++) {
            addDataPoint(YYYYMMDDFormattedDate(dateOffset));
        }
    }

    return [labels, data];
}
