import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

export type DateToWeight = Record<string, number>;
export type DateToNotes = Record<string, string>;

export interface Props {
    children: ReactNode;
}

export type WeightTrackingGraphContextPartial = {
  ui?: Partial<WeightTrackingGraphContext['ui']>;
  userData?: Partial<WeightTrackingGraphContext['userData']>;
  data?: Partial<WeightTrackingGraphContext['data']>;
};

export type WeightTrackingUIPartial = {
    ui : Partial<WeightTrackingGraphContext['ui']>;
}

export interface WeightTrackingGraphContext {
    ui: {
        trendlineEnabled: boolean;
        goalWeightEnabled: boolean;
        enableWeightPrediction: boolean;
        dateRange: number;
        isLoading: boolean;
    }

    userData: {
        goalDate: Dayjs;
        goalWeightKg: number;
        hasGoalWeight: boolean;
    };

    data: {
        dateToWeightKg: DateToWeight;
        dateToNotes: DateToNotes;
        datesWithWeight: string[];
    };

    setPartialState: (partialState: Partial<WeightTrackingGraphContextPartial>) => void;
    syncGoalWeight: (goalDate: Dayjs, weightInUserUnit: number) => Promise<boolean>;
    syncWeightEntry: (date: Dayjs, weightInUserUnit: number, notes: string ) => Promise<boolean>;
};
