import dayjs from 'dayjs';
import { measurementSystemToUnit } from 'services/WeightTracking/utils';
import { MeasurementSystem, WeightEntry } from 'services/WeightTracking/WeightTrackingInterfaces';

import {
    DateToNotes, DateToWeight, WeightTrackingGraphContext
} from './WeightTrackingGraphContextInterfaces';

export const trendlineEnabledLocalStorageKey = 'trendlineEnabled';
export const goalWeightEnabledLocalStorageKey ='goalWeightEnabled';
export const weightPredictionEnabledLocalStorageKey = 'enableWeightPrediction'

export const localStorageKeys: (keyof WeightTrackingGraphContext)[] = [
    trendlineEnabledLocalStorageKey,
    goalWeightEnabledLocalStorageKey,
    weightPredictionEnabledLocalStorageKey
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
    setPartialState: () => {}, // Dummy function, will be replaced with the actual logic
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

export function getLocalStorage(key: string): boolean {
    let storage = localStorage.getItem(key);
    return storage === null ? false : JSON.parse(storage); 
}

export function setLocalStorage(key: string, value: boolean) {
    localStorage.setItem(key, JSON.stringify(value));
}
