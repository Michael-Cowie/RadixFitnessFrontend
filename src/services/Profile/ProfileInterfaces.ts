export const measurementSystems = ['Metric', 'Imperial'] as const;

export type MeasurementSystem = (typeof measurementSystems)[number];
