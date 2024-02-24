import { TooltipItem } from 'chart.js';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import {
    DateToNotes
} from 'context/WeightTrackingGraphContext/WeightTrackingGraphContextInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import { findClosestDate, findFurtherestDate } from 'lib/dateUtils';
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

export function determine_tooltip(labels: string[], dateToNotes: DateToNotes, displayUnit: AvailableWeightUnits){
    function inner(tooltipItem: TooltipItem<'line'>) {
        const label: string = tooltipItem.label;
        const weight: string = tooltipItem.parsed['y'].toFixed(2);


        if (tooltipItem.dataset.label === 'Goal Prediction') {
            const firstNonNullIndex = tooltipItem.dataset.data.findIndex(item => item !== null);
            if (firstNonNullIndex == tooltipItem.dataIndex) {
                return '' // The first data point overlaps, do not display a tooltip.
            } else {
                return `On ${ label }, you are predicted to weigh ${ weight }${ displayUnit }`
            }
        } else if (tooltipItem.dataset.label === `Weight in ${ displayUnit }`) {
            const notes: string = dateToNotes[labels[tooltipItem.dataIndex]]
            /**
             * react-chartjs2 accepts an array of strings where each index creates a new line between
             * each other. It does not accept new line characters in a single string.
             */
            let tooltip: string[] = [`On ${ label }, you weighed ${ weight }${ displayUnit }`];
            if (notes.length) {
                tooltip.push('');
                tooltip = tooltip.concat(splitStringIntoArray(notes, tooltip[0].length))
            }

            return tooltip;
        } else if (tooltipItem.dataset.label === 'Goal Weight') {
            return `You have a goal to weigh ${ weight }${ displayUnit } on ${label}, keep it up!`;
        }
    }
    return inner;
}

export function calculateLossOrGain(weightList: number[]) {
    const differences = weightList.map((weight, index) => index > 0 ? weight - weightList[index - 1] : 0);
    const sumOfDifferences = differences.reduce((sum, difference) => sum + difference, 0);
    const averageLossOrGain = sumOfDifferences / (weightList.length - 1);
    return averageLossOrGain
}

/**
 * 
 * @param dateToUserData Users weight entries
 * @param dateRange Selected date range
 * @returns The minimum label that is to be used in the X axis, a date in YYYY-MM-DD format.
 */
function getMinimumDate(): Dayjs {
    const { datesWithWeight, dateRange } = useWeightTrackingGraphContext();

    if (dateRange === Infinity) {
        return dayjs(findFurtherestDate(datesWithWeight));
    } else {
        return dayjs().subtract(dateRange, 'days');
    }
}

/**
 * 
 * @param goalInformation Information on the user settings for the goal date and weight.
 * @returns The maximum label that is to be used in the X axis, a date in YYYY-MM-DD format.
 */
function getMaximumDateFromGoalInformation(): Dayjs {
    const { goalWeightEnabled, goalDate } = useWeightTrackingGraphContext();

    if (!goalWeightEnabled) return dayjs();

    return goalDate;
}

/**
 * Generates the labels that are displayed on the X axis on the line graph.
 */
export function generateLabelRange(): string[] {
    const minimumDate = getMinimumDate();
    const maximumDate = getMaximumDateFromGoalInformation();

    const labelRange = maximumDate.diff(minimumDate, 'days');

    let labels = []
    for (let offSet = 0; offSet <= labelRange; offSet++) {
        labels.push(minimumDate.add(offSet, 'days').format("YYYY-MM-DD"));
    }
    return labels;
}


export function convertDataToDisplayUnit(dataList: (number | null)[]): (number | null)[] {
    const { displayUnit } = useWeightTrackingGraphContext();

    return dataList.map((point => {
        if (point === null) {
            return point;
        } else {
            return convertKgTo(displayUnit, point);
        }
    }))
}

/**
 * Returns the Y axis plotted data for the user dataset.
 */
export function calculateUserData(labels: string[]): (number | null)[] {
    const { dateToWeightKg } = useWeightTrackingGraphContext();

    let userData = [];
    for (let label of labels) {
        if (label in dateToWeightKg) {
            userData.push(dateToWeightKg[label]);
        } else {
            userData.push(null);
        }
    }
    return userData;
}

/**
 * Returns the Y axis plotted data for the predicted dataset.
 */
export function calculatePredictedData(labels: string[], userData: (number | null)[]) {
    const { datesWithWeight, goalDate, enableWeightPrediction, dateToWeightKg } = useWeightTrackingGraphContext();

    const pastPredictedDate = goalDate.diff(dayjs(), 'days') <= 0;
    /**
     * Do not allow prediction if we either,
     *  1. Contain no data entries
     *  2. Have it disabled
     *  3. Have gone beyond the goal date.
     */
    if (datesWithWeight.length < 1 || !enableWeightPrediction || pastPredictedDate) return [];

    const closestDate = findClosestDate(datesWithWeight);
    const closestDateIndex = labels.indexOf(closestDate); 

    let predictedData = new Array(closestDateIndex).fill(null);
    predictedData.push(dateToWeightKg[closestDate]);

    // @ts-ignore
    const sortedDataWithoutNull: number[] = userData.filter(v => v !== null);
    const weightDeviation = calculateLossOrGain(sortedDataWithoutNull);

    const predictionRange = goalDate.diff(closestDate, 'days') + 1;

    const closestDateWeight = dateToWeightKg[closestDate];
    for (let offset = 1; offset < predictionRange; offset++) {
        predictedData.push(closestDateWeight + (weightDeviation * offset));
    }
    return predictedData;
}

/**
 * Returns the Y axis dataset for the goal weight.
 */
export function calculateGoalWeightData(labels: string[]) {
    const { goalWeightEnabled, goalWeightKg } = useWeightTrackingGraphContext();
    
    if (!goalWeightEnabled) return [];

    let goalWeightData = new Array(labels.length - 1).fill(null);
    goalWeightData.push(goalWeightKg);
    return goalWeightData;
}

/**
 * Given a series of YYYY-MM-DD formatted dates, returns them to a "MM - DD" format
 * to be displayed nicely on the graph labels.
 */
export function formatLabels(labels: string[]): string[] {
    return labels.map((label) => dayjs(label).format("MM - DD"));
}
