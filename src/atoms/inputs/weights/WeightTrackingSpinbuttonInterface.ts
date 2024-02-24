
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export interface Props {
    defaultValue: number
    displayUnit: AvailableWeightUnits
    name: string,
    label: string,
    disabled?: boolean,
}
