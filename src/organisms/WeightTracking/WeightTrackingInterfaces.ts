
import { DateToWeight } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export interface Props {
    displayUnit: AvailableWeightUnits,
    dateRange: number,
    initialData: DateToWeight,
    trendLineEnabled: boolean
}

export interface ToolTip {
  label: string,
  raw: string
}