import dayjs from 'dayjs';
import { WeightEntry } from 'services/WeightTracking/WeightTrackingInterfaces';

import {
  DateToNotes,
  DateToWeight,
  WeightTrackingGraphContext,
} from './WeightTrackingGraphContextInterfaces';

export const trendlineEnabledLocalStorageKey = 'trendlineEnabled' as const;
export const goalWeightEnabledLocalStorageKey = 'goalWeightEnabled' as const;
export const weightPredictionEnabledLocalStorageKey = 'enableWeightPrediction' as const;
export const selectedDateRangeLocalStorageKey = 'dateRange' as const;

export const userInterfaceLocalStorageKeys: (keyof WeightTrackingGraphContext['ui'])[] = [
  trendlineEnabledLocalStorageKey,
  goalWeightEnabledLocalStorageKey,
  weightPredictionEnabledLocalStorageKey,
  selectedDateRangeLocalStorageKey,
];

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
    goalWeightKg: 70,
    hasGoalWeight: false,
  },

  data: {
    dateToWeightKg: {},
    dateToNotes: {},
    datesWithWeight: [],
  },
  setPartialState: () => {},
  syncGoalWeight: async () => {},
  syncWeightEntry: async () => {},
};

export function gatherDateInformation(
  userEntries: WeightEntry[],
): [DateToWeight, DateToNotes, string[]] {
  const dateToWeightKg: DateToWeight = {};
  const dateToNotes: DateToNotes = {};
  const datesWithWeight: string[] = [];

  userEntries.forEach((dateEntry) => {
    const date = dateEntry.date;

    dateToWeightKg[date] = dateEntry.weight_kg;
    dateToNotes[date] = dateEntry.notes;
    datesWithWeight.push(date);
  });

  return [dateToWeightKg, dateToNotes, datesWithWeight];
}

const getFullLocalStorageKey = (key: string, user_id: string): string => {
  return 'user_' + user_id + '_' + key;
};

export function getLocalStorage(key: string, user_id: string): string | null | boolean {
  const storage = localStorage.getItem(getFullLocalStorageKey(key, user_id));

  if (storage === null) {
    return null;
  }

  return JSON.parse(storage);
}

export function setLocalStorage(key: string, user_id: string, value: boolean) {
  localStorage.setItem(getFullLocalStorageKey(key, user_id), JSON.stringify(value));
}
