import { Dayjs } from 'dayjs';

export type DateToWeight = Record<string, string>

export type DateToUserData = {
    [date: string]: {
      weight_kg: number;
      notes: string;
  };
};

export type GoalInformation = {
  goalDate: Dayjs,
  goalWeight: number,
  enablePrediction: boolean
}
