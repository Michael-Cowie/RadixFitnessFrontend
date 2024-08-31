import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import dayjs, { Dayjs } from 'dayjs';
import { findClosestDateFromToday } from 'lib/dateUtils';
import { SyntheticEvent } from 'react';
import { convertKgTo, convertWeight, formatToTwoPrecision } from 'services/WeightTracking/utils';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';

export function getWeightFromDate(date: string): number {
    const { displayUnit, dateToWeightKg} = useWeightTrackingGraphContext();
    
    return convertKgTo(displayUnit, dateToWeightKg[date])
}

export function getNotesFromDate(date: string): string {
    const { dateToNotes } = useWeightTrackingGraphContext();

    if (date in dateToNotes) {
        return dateToNotes[date];
    }
    return '';
}

export function getDefaultValue(): number {
    const { displayUnit , datesWithWeight, dateToWeightKg } = useWeightTrackingGraphContext();
    const today = dayjs().format("YYYY-MM-DD");

    const averagePersonWeightKg = 70;
    if (datesWithWeight.length == 0){
        switch (displayUnit) {
            case "kg":
                return averagePersonWeightKg;
            case "lbs":
                return convertKgTo("lbs", averagePersonWeightKg);
            default:
                throw new Error("Invalid unit provided");
        }
    } else if (today in dateToWeightKg) {
        return convertKgTo(displayUnit, dateToWeightKg[today]);
    } else {
        const latestEntry = findClosestDateFromToday(datesWithWeight);
        return convertKgTo(displayUnit, dateToWeightKg[latestEntry]);
    }
}

export function getWeightText(updating: boolean, formattedDate: string): string {
    const { displayUnit } = useWeightTrackingGraphContext();

    if (!updating) {
        return `Weight`;
    } 
    const weight = formatToTwoPrecision(getWeightFromDate(formattedDate));
    return `Updating ${ weight }${ displayUnit } to`
}

/**
 * Returns the three inputs,
 * 
 * Date - In YYYY-MM-DD format.
 * Weight - As a number from the spinbutton.
 * Notes - As a string.
 */
export function getResultsFromForm(event: SyntheticEvent, displayUnit: AvailableWeightUnits): [Dayjs, number, string] {
    const form = event.target as HTMLFormElement
    
    const formattedDate = dayjs((form.elements.namedItem("datePicker") as HTMLInputElement).value);
    const notes= (document.getElementById('notesTextArea') as HTMLTextAreaElement).value;

    let weightInput = parseFloat((form.elements.namedItem('weightInput') as HTMLInputElement).value);
    weightInput = convertWeight(displayUnit, "kg", weightInput);
    return [formattedDate, weightInput, notes];
}
