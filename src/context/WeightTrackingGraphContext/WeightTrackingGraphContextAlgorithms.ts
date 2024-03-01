import dayjs from 'dayjs';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';
import { measurementSystemToUnit } from 'services/WeightTracking/utils';
import { WeightEntry } from 'services/WeightTracking/WeightTrackingInterfaces';

import {
    DateToNotes, DateToWeight, WeightTrackingGraphContext
} from './WeightTrackingGraphContextInterfaces';

export const trendlineEnabledLocalStorageKey = 'trendlineEnabled';
export const goalWeightEnabledLocalStorageKey ='goalWeightEnabled';
export const weightPredictionEnabledLocalStorageKey = 'enableWeightPrediction';
export const selectedDateRangeLocalStorageKey = 'dateRange';

export const localStorageKeys: (keyof WeightTrackingGraphContext)[] = [
    trendlineEnabledLocalStorageKey,
    goalWeightEnabledLocalStorageKey,
    weightPredictionEnabledLocalStorageKey,
    selectedDateRangeLocalStorageKey,
]

export const createDefaultState = (measurementSystem: MeasurementSystem): WeightTrackingGraphContext => ({
    displayUnit: measurementSystemToUnit(measurementSystem),
    trendlineEnabled: false,
    goalWeightEnabled: false,
    goalDate: dayjs(new Date()).add(7, 'days'),
    goalWeightKg: 70,
    enableWeightPrediction: false,
    dateToWeightKg: {},
    dateToNotes: {},
    updatingGoalWeight: false,
    datesWithWeight: [],
    isLoading: true,
    dateRange: 7,
    setPartialState: () => {}
});

export function gatherDateInformation(userEntries: WeightEntry[]): [DateToWeight, DateToNotes, string[]] {
    let dateToWeightKg: DateToWeight = {};
    let dateToNotes: DateToNotes = {};
    let datesWithWeight: string[] = [];


    userEntries.forEach(dateEntry => {
        const date = dateEntry.date;

        dateToWeightKg[date] = dateEntry.weight_kg;
        dateToNotes[date] = dateEntry.notes;
        datesWithWeight.push(date);
    });

    return [dateToWeightKg, dateToNotes, datesWithWeight];
}

export function getLocalStorage(key: string): any {
    let storage = localStorage.getItem(key);

    if ( storage === null) {
        return null;
    }

    return JSON.parse(storage);
}

export function setLocalStorage(key: string, value: boolean) {
    localStorage.setItem(key, JSON.stringify(value));
}
