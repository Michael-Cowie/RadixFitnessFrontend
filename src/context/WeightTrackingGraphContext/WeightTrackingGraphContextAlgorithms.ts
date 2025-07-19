import dayjs from 'dayjs';
import { WeightEntry } from 'services/WeightTracking/WeightTrackingInterfaces';

import {
    DateToNotes, DateToWeight, WeightTrackingGraphContext
} from './WeightTrackingGraphContextInterfaces';

export const trendlineEnabledLocalStorageKey = 'trendlineEnabled';
export const goalWeightEnabledLocalStorageKey ='goalWeightEnabled';
export const weightPredictionEnabledLocalStorageKey = 'enableWeightPrediction';
export const selectedDateRangeLocalStorageKey = 'dateRange';

export const userInterfaceLocalStorageKeys: (keyof WeightTrackingGraphContext['ui'])[] = [
    trendlineEnabledLocalStorageKey,
    goalWeightEnabledLocalStorageKey,
    weightPredictionEnabledLocalStorageKey,
    selectedDateRangeLocalStorageKey,
]

export const DefaultWeightTrackingGraphContext: WeightTrackingGraphContext = {
  ui: {
    trendlineEnabled: false,
    goalWeightEnabled: false,
    enableWeightPrediction: false,
    dateRange: 7,
    isLoading: true,
  },

  userData: {
    goalDate: dayjs(),
    goalWeightKg: 0,
    hasGoalWeight: false,
  },

  data: {
    dateToWeightKg: {},
    dateToNotes: {},
    datesWithWeight: [],
  },
  setPartialState: () => {},
  syncGoalWeight: async () => false,
  syncWeightEntry: async() => false,
};

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


const getFullLocalStorageKey = (key: string, user_id: string): string => {
    return 'user_' + user_id + '_' + key;
}

export function getLocalStorage(key: string, user_id: string): any {
    let storage = localStorage.getItem(getFullLocalStorageKey(key, user_id));

    if ( storage === null) {
        return null;
    }

    return JSON.parse(storage);
}

export function setLocalStorage(key: string, user_id: string, value: boolean) {
    localStorage.setItem(getFullLocalStorageKey(key, user_id), JSON.stringify(value));
}
