import dayjs, { Dayjs } from 'dayjs';
import { findClosestDateFromToday } from 'lib/dateUtils';
import { SyntheticEvent } from 'react';
import {
  convertKgTo,
  formatToTwoPrecision,
  measurementSystemToUnit,
  weightFromKgToUserMeasurementSystem,
} from 'lib/weightTranslations';
import { MeasurementSystem } from 'services/Profile/ProfileInterfaces';

export function getWeightFromDate(
  date: string,
  userMeasurementSystem: MeasurementSystem,
  dateToWeightKg: Record<string, number>,
): number {
  return weightFromKgToUserMeasurementSystem(dateToWeightKg[date], userMeasurementSystem);
}

export function getNotesFromDate(date: string, dateToNotes: Record<string, string>): string {
  return date in dateToNotes ? dateToNotes[date] : '';
}

export function getDefaultValue(
  formattedDate: string,
  userMeasurementSystem: MeasurementSystem,
  datesWithWeight: string[],
  dateToWeightKg: Record<string, number>,
): number {
  const averagePersonWeightKg = 70;
  const weightUnit = measurementSystemToUnit(userMeasurementSystem);
  const today = dayjs().format('YYYY-MM-DD');

  if (datesWithWeight.length === 0) {
    switch (weightUnit) {
      case 'kg':
        return averagePersonWeightKg;
      case 'lbs':
        return convertKgTo('lbs', averagePersonWeightKg);
      default:
        throw new Error('Invalid unit provided');
    }
  } else if (formattedDate in dateToWeightKg) {
    return getWeightFromDate(formattedDate, userMeasurementSystem, dateToWeightKg);
  } else if (today in dateToWeightKg) {
    return getWeightFromDate(today, userMeasurementSystem, dateToWeightKg);
  } else {
    const latestEntry = findClosestDateFromToday(datesWithWeight);
    return getWeightFromDate(latestEntry, userMeasurementSystem, dateToWeightKg);
  }
}

export function getWeightText(
  updating: boolean,
  formattedDate: string,
  userMeasurementSystem: MeasurementSystem,
  dateToWeightKg: Record<string, number>,
): string {
  if (!updating) {
    return `Weight`;
  }
  const weight = formatToTwoPrecision(
    getWeightFromDate(formattedDate, userMeasurementSystem, dateToWeightKg),
  );
  return `Updating ${weight}${measurementSystemToUnit(userMeasurementSystem)} to`;
}

export function getResultsFromForm(event: SyntheticEvent): [Dayjs, number, string] {
  const form = event.target as HTMLFormElement;

  const formattedDate = dayjs((form.elements.namedItem('datePicker') as HTMLInputElement).value);
  const notes = (document.getElementById('notesTextArea') as HTMLTextAreaElement).value;
  const weightInput = parseFloat(
    (form.elements.namedItem('weightInput') as HTMLInputElement).value,
  );

  return [formattedDate, weightInput, notes];
}
