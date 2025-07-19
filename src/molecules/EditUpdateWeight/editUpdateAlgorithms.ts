import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import dayjs, { Dayjs } from 'dayjs';
import { findClosestDateFromToday } from 'lib/dateUtils';
import { SyntheticEvent } from 'react';
import { convertKgTo, formatToTwoPrecision, measurementSystemToUnit, weightFromKgToUserMeasurementSystem, weightFromUserMeasurementSystemtoKg } from 'lib/weightTranslations';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

export function getWeightFromDate(date: string, userMeasurementSystem: MeasurementSystem): number {
    const { 
        data: {
            dateToWeightKg 
        }
    } = useWeightTrackingGraphContext();    
    return weightFromKgToUserMeasurementSystem(dateToWeightKg[date], userMeasurementSystem);
}

export function getNotesFromDate(date: string): string {
    const { 
        data : {
            dateToNotes 
        }
    } = useWeightTrackingGraphContext();

    if (date in dateToNotes) {
        return dateToNotes[date];
    }
    return '';
}

export function getDefaultValue(
  userMeasurementSystem: MeasurementSystem,
  datesWithWeight: string[],
  dateToWeightKg: Record<string, number>
): number {
  const averagePersonWeightKg = 70;
  const weightUnit = measurementSystemToUnit(userMeasurementSystem);
  const today = dayjs().format("YYYY-MM-DD");

  if (datesWithWeight.length === 0) {
    switch (weightUnit) {
      case "kg":
        return averagePersonWeightKg;
      case "lbs":
        return convertKgTo("lbs", averagePersonWeightKg);
      default:
        throw new Error("Invalid unit provided");
    }
  } else if (today in dateToWeightKg) {
    return weightFromKgToUserMeasurementSystem(dateToWeightKg[today], userMeasurementSystem);
  } else {
    const latestEntry = findClosestDateFromToday(datesWithWeight);
    return weightFromKgToUserMeasurementSystem(dateToWeightKg[latestEntry], userMeasurementSystem);
  }
}

export function getWeightText(updating: boolean, formattedDate: string, userMeasurementSystem: MeasurementSystem): string {
    if (!updating) {
        return `Weight`;
    } 
    const weight = formatToTwoPrecision(getWeightFromDate(formattedDate, userMeasurementSystem));
    return `Updating ${ weight }${ measurementSystemToUnit(userMeasurementSystem) } to`
}


export function getResultsFromForm(event: SyntheticEvent, userMeasurementSystem: MeasurementSystem): [Dayjs, number, string] {
    const form = event.target as HTMLFormElement
    
    const formattedDate = dayjs((form.elements.namedItem("datePicker") as HTMLInputElement).value);
    const notes= (document.getElementById('notesTextArea') as HTMLTextAreaElement).value;
    const weightInput = parseFloat((form.elements.namedItem('weightInput') as HTMLInputElement).value);

    return [formattedDate, weightFromUserMeasurementSystemtoKg(weightInput, userMeasurementSystem), notes];
}
