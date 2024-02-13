import { findLatestDate } from 'lib/dateUtils';

import { DateToWeight } from './WeightTrackingPageInterfaces';

export function createDisplayText(range: number): string {
    if (range === Infinity) return "All";
    return `${range} days`;
}
  
export function getDefaultValue(existingWeight: DateToWeight): string {
    if (Object.keys(existingWeight).length == 0){
        const averagePersonWeightKg = '65';
        return averagePersonWeightKg;
    } else {
        const latestEntry = findLatestDate(Object.keys(existingWeight));
        return existingWeight[latestEntry];
    }
}
