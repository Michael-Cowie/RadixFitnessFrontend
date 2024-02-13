import { DateToUserData } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export interface Props {
    displayUnit: AvailableWeightUnits
    onSuccess: Function,
    closeModalWindow: () => void,
    dateData: DateToUserData
}