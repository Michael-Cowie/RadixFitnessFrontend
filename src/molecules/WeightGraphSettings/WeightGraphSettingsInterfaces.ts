import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export type SettingsChanged = {
    enableTrendline: boolean,
    displayUnit: AvailableWeightUnits,
    enableGoalSettings: boolean,
    goalDate: string,
    goalWeight: number,
    enableWeightPredicion: boolean

}

export interface Props {
    closeModalWindow: () => void;
}
