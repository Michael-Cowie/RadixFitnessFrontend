import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

import { AvailableWeightUnits } from '../services/WeightTracking/WeightTrackingInterfaces';

const kg_to_lbs = 2.2046226218488;

const measurementSystemToWeightUnit: Record<MeasurementSystem, AvailableWeightUnits> = {
  "Metric": "kg",
  "Imperial": "lbs"
}

export function formatToTwoPrecision(weight: number): string {
  return String(weight.toFixed(2));
}

function kgToLbs(kg: number): number {
  return kg * 2.2046226218488;
}

function lbsToKg(lbs: number): number {
  return lbs / kg_to_lbs;
}


/**
 * 
 * @param unit The default weight returned from the server is in kg, create a standard function for that primary use case.
 * @param weight Weight on a particular date.
 * @returns Converted unit
 */
export function convertKgTo(unit: AvailableWeightUnits, weight: number): number {
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
export function convertWeight(fromUnit: AvailableWeightUnits, toUnit: AvailableWeightUnits, weight: number): number {
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
    return measurementSystemToWeightUnit[system];
}

/**
 * 
 * @param weight Unit agnostic weight.
 * @returns Weight in kg.
 */
export function weightFromUserMeasurementSystemtoKg(weight: number, userMeasurementSystem: MeasurementSystem): number {
  return convertWeight(measurementSystemToUnit(userMeasurementSystem), "kg", weight);
}

/**
 * 
 * @param weight Weight in kg.
 * @returns Weight in user profile measurement system.
 */
export function weightFromKgToUserMeasurementSystem(weight: number, userMeasurementSystem: MeasurementSystem): number {
  return convertWeight("kg", measurementSystemToUnit(userMeasurementSystem), weight);
}