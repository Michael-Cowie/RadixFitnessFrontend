import { TooltipItem } from 'chart.js';
import {
    findFurtherestDate, findLatestDate, formattedDateWithOffset, formattedDateWithOffsetFrom,
    removeYearFromDate
} from 'lib/dateUtils';
import { DateToUserData } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { convertKgTo } from 'services/WeightTracking/utils';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

function splitStringIntoArray(inputString: string, maxLength: number): string[] {
    const resultArray = [];
    let startIndex = 0;

    while (startIndex < inputString.length) {
        const endIndex = startIndex + maxLength;
        const substring = inputString.substring(startIndex, endIndex).trim();
        resultArray.push(substring);
        startIndex = endIndex;
    }

    return resultArray;
}

export function determine_tooltip(formattedDates: string[], dateToUserData: DateToUserData, displayUnit: AvailableWeightUnits){
    function inner(tooltipItem: TooltipItem<'line'>) {
        const label = tooltipItem.label;
        const weight_kg = tooltipItem.raw;
        const notes = dateToUserData[formattedDates[tooltipItem.dataIndex]].notes
        /**
         * react-chartjs2 accepts an array of strings where each index creates a new line between
         * each other. It does not accept new line characters in a single string.
         */
        let tooltip: string[] = [`On ${label}, you weighed ${weight_kg}${displayUnit}`];
        if (notes.length) {
            tooltip.push('');
            tooltip = tooltip.concat(splitStringIntoArray(notes, tooltip[0].length))
        }

        return tooltip;
    }
    return inner;
}

export function plottingData(dateToUserData: DateToUserData, dateRange: number, unit: AvailableWeightUnits): [string[], (string | null)[], string[]] {
    const minimumFutureDays = 1;
    const minimumNumberDays = 7;

    const data: (string | null)[] = [];
    const labels: string[] = [];
    const formattedDates: string[] = [];


    const addDataPoint = (formattedDate: string): void => {
        data.push(formattedDate in dateToUserData ? convertKgTo(unit, dateToUserData[formattedDate].weight_kg) : null);
        labels.push(removeYearFromDate(formattedDate));
        formattedDates.push(formattedDate);
    };

    if (dateRange === Infinity) {
        const datesWithWeight: string[] = Object.keys(dateToUserData);

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

    return [labels, data, formattedDates];
}
