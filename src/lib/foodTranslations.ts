import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

export type AvailableFoodWeightUnits = 'g';

const measurementSystemToFoodMassUnit: Record<MeasurementSystem, AvailableFoodWeightUnits> = {
  Metric: 'g',
  Imperial: 'g',
};

/**
 *  Returns the unit of measurement that the user has specified for the food mass.
 *
 * @param userMeasurementSystem Unit measurement system
 */
export function userMeasureSystemToFoodUnit(
  userMeasurementSystem: MeasurementSystem,
): AvailableFoodWeightUnits {
  return measurementSystemToFoodMassUnit[userMeasurementSystem];
}
