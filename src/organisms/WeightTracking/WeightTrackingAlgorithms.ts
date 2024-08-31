import { TooltipItem } from 'chart.js';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import {
    DateToNotes
} from 'context/WeightTrackingGraphContext/WeightTrackingGraphContextInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import {
    findClosestDateFromToday, findFurtherestDateFromToday, getFurthestFutureDate,
    getFurthestPastDate
} from 'lib/dateUtils';
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
    if (weightList.length == 1) return 0;
    
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
        return dayjs(findFurtherestDateFromToday(datesWithWeight));
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
    let today = dayjs()

    if (!goalWeightEnabled) return today;
    if (goalDate.isBefore(today)) return today;

    return goalDate;
}

/**
 * Generates the labels that are displayed on the X axis on the line graph.
 * 
 * ---------- Notes ----------
 * 
 * Writing this function, my original implementation used the diff method to compute the range and did not work.
 * 
 * This appeared as such,
 *  
 *  const labelRange = maximumDate.diff(minimumDate, 'days');
 *
 *  let labels = []
 *  for (let offSet = 0; offSet <= labelRange; offSet++) {
 *      labels.push(minimumDate.add(offSet, 'days').format("YYYY-MM-DD"));
 *  }
 * 
 * The problem is that the diff method will compute the difference in days in milliseconds
 * and when converting this to 'days', it will always round down. Hence, the difference
 * between,
 * 
 * let today = dayjs("2024-02-26");
 * let minimumDate = dayjs().subtract(3, 'days');
 * today.diff(minimumDate, 'days');                  // 2
 * today.diff(minimumDate, 'days', true)             // 2.159. This will always round down, i.e. 2.7 -> 2.
 * 
 * Therefore, to utilize diff and subtraction, we need to adjust the start of the minimum date to 
 * midnight via startOf('days') to properly get 3. However, instead of using diff and iterating
 * over a range we can use isAfter and a while loop is nicer.
 * 
 * ---------- Caveat ----------
 * 
 * Using dayjs(), objects will do arithmatic in local time but will be displayed in UTC + 0. For example,
 * creating an object as `dayjs("2024-02-26")`, which is the 26th February. This will be displayed to the
 * console as `25th Feb 2024, 11:00:00 GMT`. This is because in New Zealand during daylight savings
 * we are currently at GMT + 13, meaning the console will display it 13 hours prior in GMT + 0, which
 * will be at 11am on the 25th of February.
 * 
*/
export function generateDateRange(): Dayjs[] {
    const minimumDate = getMinimumDate();
    const maximumDate = getMaximumDateFromGoalInformation();

    let date = minimumDate.startOf('day'); // Adjust to the start of the day, maximum date is always beginning of day.
    let dates: Dayjs[] = [];

    while (!date.isAfter(maximumDate)) {
        dates.push(date);
        date = date.add(1, 'days');
    }

    return dates;
}

export function generateLabelsFromDates(dates: Dayjs[]): string[] {
    return dates.map(date => date.format('YYYY-MM-DD'));
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
     *  1. Contain no dates with a weight entry
     *  2. Have it disabled
     *  3. Have gone beyond the goal date.
     */
    if (datesWithWeight.length < 1 || !enableWeightPrediction || pastPredictedDate) return [];

    const closestDate = findClosestDateFromToday(datesWithWeight);
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
export function calculateGoalWeightData(dates: Dayjs[]): (number | null)[] {
    const { goalWeightEnabled, goalWeightKg, goalDate } = useWeightTrackingGraphContext();
    
    if (!goalWeightEnabled) return [];

    let goalWeightData: (number | null)[] = [];
    for (let date of dates) {
        if (date.diff(goalDate) == 0){
            goalWeightData.push(goalWeightKg)
        } else {
            goalWeightData.push(null)
        }
    }

    return goalWeightData;
}

/**
 * Given a series of YYYY-MM-DD formatted dates, returns them to a "MM - DD" format
 * to be displayed nicely on the graph labels.
 */
export function formatLabels(labels: string[]): string[] {
    return labels.map((label) => dayjs(label).format("MM - DD"));
}
