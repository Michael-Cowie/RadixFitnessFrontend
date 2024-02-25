import { ReactNode } from 'react';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

export const defaultMeasurementSystem = "Metric";

export interface Profile {
    loading: boolean,
    updateProfileContext: (name: string, measurementSystem: MeasurementSystem) => void;
    name: string,
    measurementSystem: MeasurementSystem
}

export interface Props {
    children: ReactNode;
}
