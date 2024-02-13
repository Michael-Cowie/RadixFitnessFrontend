import { findLatestDate } from 'lib/dateUtils';
import { FormEvent, SyntheticEvent } from 'react';
import { DateToUserData } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';
import { convertKgTo } from 'services/WeightTracking/utils';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export function getWeightFromDate(dateData: DateToUserData, date:string, toUnit: AvailableWeightUnits): string {
    return convertKgTo(toUnit, dateData[date].weight_kg)
}

export function getNotesFromDate(dateData: DateToUserData, date:string): string {
    if (date in dateData) {
        return dateData[date].notes;
    }
    return '';
}

export function getDefaultValue(date: string, unit: AvailableWeightUnits, existingWeight: DateToUserData): string {
    const averagePersonWeightKg = '65';
    if (Object.keys(existingWeight).length == 0){
        switch (unit) {
            case "kg":
                return averagePersonWeightKg;
            case "lbs":
                return convertKgTo(unit, averagePersonWeightKg);
            default:
                throw new Error("Invalid unit provided");
        }
    } else if (date in existingWeight) {
        return convertKgTo(unit, existingWeight[date].weight_kg);
    } else {
        const latestEntry = findLatestDate(Object.keys(existingWeight));
        return convertKgTo(unit, existingWeight[latestEntry].weight_kg);
    }
}

export function getWeightText(updating: boolean, displayUnit: AvailableWeightUnits, dateData: DateToUserData, formattedDate: string): string {
    if (!updating) {
        return `Weight in ${ displayUnit }`;
    } 
    const weight = getWeightFromDate(dateData, formattedDate, displayUnit);
    return `From ${weight}${displayUnit} to`
}

export function getResultsFromForm(event: SyntheticEvent): string {
    const form = event.target as HTMLFormElement
    const weightInput = form.elements.namedItem('weightInput') as HTMLInputElement;
    return weightInput.value;
}

export function validateInput(event: FormEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toString();
    
    const isValid = /^\d+(\.\d{1,2})?$/.test(value);
    
    if (!isValid) {
        input.setCustomValidity("Please enter a number with no more than 2 decimal places.");
    } else {
        input.setCustomValidity("");
    }
}
