export const measurementSystems = ['Metric', 'Imperial'] as const;

export type MeasurementSystem = (typeof measurementSystems)[number];

export interface UserProfile {
  name: string;
  measurement_system: MeasurementSystem;
}
