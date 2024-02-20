
import {
    DateToUserData, GoalInformation
} from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export interface Props {
    displayUnit: AvailableWeightUnits,
    dateRange: number,
    dateToUserData: DateToUserData,
    trendLineEnabled: boolean,
    goalInformation: GoalInformation
}
