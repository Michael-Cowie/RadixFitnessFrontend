import { Dayjs } from 'dayjs';

export type NutrientKey = 'calories' | 'protein' | 'carbs' | 'fats';

export interface SummaryItem {
  totalConsumed: number;
  totalGoal: number;
  percentageOfGoal: number;
  averageConsumed: number;
}

export type Summary = Record<NutrientKey, SummaryItem>;

export interface MacronutrientAnalyticsSummary {
  startDate: Dayjs;
  endDate: Dayjs;
  daysWithLogs: number;
  summary: Summary;
}
