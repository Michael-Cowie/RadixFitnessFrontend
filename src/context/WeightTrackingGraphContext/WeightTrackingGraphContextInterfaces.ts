import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export type DateToWeight = Record<string, number>;
export type DateToNotes = Record<string, string>;

export interface WeightTrackingGraphContext {
    displayUnit: AvailableWeightUnits;
    trendlineEnabled: boolean;
    goalWeightEnabled: boolean;
    goalDate: Dayjs;
    goalWeightKg: number;
    enableWeightPrediction: boolean;
    dateToWeightKg: DateToWeight;
    dateToNotes: DateToNotes;
    updatingGoalWeight: boolean;
    datesWithWeight: string[];
    dateRange: number,
    isLoading: boolean;
    setPartialState: (partialState: Partial<WeightTrackingGraphContext>) => void;
}

export interface Props {
    children: ReactNode;
}
