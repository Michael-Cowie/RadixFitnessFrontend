import { AvailableWeightUnits, MeasurementSystem } from './WeightTrackingInterfaces';

function formatToTwoPrecision(weight: number): string {
  return String(weight.toFixed(2));
}

function kgToLbs(kg: string): string {
  return formatToTwoPrecision(Number(kg) * 2.20462);
}

function lbsToKg(lbs: string): string {
  return formatToTwoPrecision(Number(lbs) * 0.453592);
}

/**
 * 
 * @param unit The default weight returned from the server is in kg, create a standard function for that primary use case.
 * @param weight Weight on a particular date.
 * @returns A string representation of the converted unit, rounded to 2 decimal points of precision.
 */
export function convertKgTo(unit: AvailableWeightUnits, weight: string): string {
  switch (unit) {
    case "kg":
      return weight;
    case "lbs":
      return kgToLbs(weight);
    default:
      throw new Error("Invalid unit to convert to");
  }
}

/**
 * 
 * @param fromUnit The unit that the provided weight is in.
 * @param toUnit The unit that we want to convert to provided weight to.
 * @param weight The provided weight that we want to convert.
 * @returns A string representation of the converted unit, rounded to 2 decimal points of precision.
 */
export function convertWeight(fromUnit: AvailableWeightUnits, toUnit: AvailableWeightUnits, weight: string): string {
  if (fromUnit == toUnit) {
    return weight;
  }

  switch (fromUnit) {
    case "kg":
      switch (toUnit) {
        case "lbs":
          return kgToLbs(weight);
      
      default:
        throw new Error("Invalid to unit");
      }
    case "lbs":
      switch (toUnit) {
        case "kg":
          return lbsToKg(weight);
        default:
          throw new Error("Invalid to unit");
      }
    default:
      throw new Error("Invalid from unit");
  }
}


/**
 * 
 * @param system The currently provided measurement system that the user uses.
 * @returns Returns an availabe weight from the current measurement system.
 */
export function measurementSystemToUnit(system: MeasurementSystem): AvailableWeightUnits {
    const conversion: Record<MeasurementSystem, AvailableWeightUnits> = {
      "Metric": "kg",
      "Imperial": "lbs"
    }
    return conversion[system];
}
