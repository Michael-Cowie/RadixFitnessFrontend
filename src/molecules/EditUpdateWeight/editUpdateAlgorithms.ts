import dayjs, { Dayjs } from 'dayjs';
import { findClosestPreviousDateFrom } from 'lib/dateUtils';
import { SyntheticEvent } from 'react';
import {
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

export function getDefaultWeight(
  formattedDate: string,
  userMeasurementSystem: MeasurementSystem,
  datesWithWeight: string[],
  dateToWeightKg: Record<string, number>,
): number {
  const averagePersonWeightKg = 70;

  if (datesWithWeight.length === 0) {
    return weightFromKgToUserMeasurementSystem(averagePersonWeightKg, userMeasurementSystem);
  }

  if (formattedDate in dateToWeightKg) {
    return weightFromKgToUserMeasurementSystem(
      dateToWeightKg[formattedDate],
      userMeasurementSystem,
    );
  }

  const closest = findClosestPreviousDateFrom(datesWithWeight, formattedDate);

  if (closest && closest in dateToWeightKg) {
    return weightFromKgToUserMeasurementSystem(dateToWeightKg[closest], userMeasurementSystem);
  }

  return weightFromKgToUserMeasurementSystem(averagePersonWeightKg, userMeasurementSystem);
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
