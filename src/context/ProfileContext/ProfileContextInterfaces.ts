import { ReactNode } from 'react';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

export const defaultMeasurementSystem = "Metric";

export interface Profile {
    loading: boolean,
    updateProfileContext: (name: string, measurementSystem: MeasurementSystem, hasProfile: boolean) => void;
    name: string,
    measurementSystem: MeasurementSystem,
    hasProfile: boolean,
}

export interface Props {
    children: ReactNode;
}
