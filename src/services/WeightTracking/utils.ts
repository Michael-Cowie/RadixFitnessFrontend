import { AvailableWeightUnits, MeasurementSystem } from './WeightTrackingInterfaces';

/**
 * 
 * @param unit The default weight returned from the server is in kg, therefore we only need to convert to lbs.
 * @param weight Current user weight.
 * @returns string
 */
export function convertKgTo(unit: AvailableWeightUnits, weight: string): string {
    if (unit === 'lbs') {
      const kg_to_lbs = 2.20462;
      return String((Number(weight) * kg_to_lbs).toFixed(2));
    }
    return weight;
}
  
export function measurementSystemToUnit(system: MeasurementSystem): AvailableWeightUnits {
    const conversion: Record<MeasurementSystem, AvailableWeightUnits> = {
      "Metric": "kg",
      "Imperial": "lbs"
    }
    return conversion[system];
}
