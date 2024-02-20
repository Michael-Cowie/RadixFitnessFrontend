import { Dayjs } from 'dayjs';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export type SettingsChanged = {
    enableTrendline: boolean,
    displayUnit: AvailableWeightUnits,
    enableGoalSettings: boolean,
    goalDate: Dayjs,
    goalWeight: number,
    enableWeightPredicion: boolean

}

export interface Props {
    displayUnit: AvailableWeightUnits,
    onSuccess: (result: SettingsChanged) => void,
    closeModalWindow: () => void;
}