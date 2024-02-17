import dayjs, { Dayjs } from 'dayjs';
import { DateToUserData } from 'routes/WeightTrackingPage/WeightTrackingPageInterfaces';

/**
 * Do not use `toISOString`. When using date.toISOString().split('T')[0] I ran into an issue 
 * due to the time zone offset in the original date string. When you use `toISOString()`, it 
 * returns the date in UTC + 0. I live in New Zealand and we use GMT +12, so there is a 
 * difference of 12 hours between the original date and the UTC date.
 * 
 * @param date A Date object
 * @param includeYear Include the year in the formatted date.
 * @returns A string object that is either "YYYY-MM-DD" or "MM-DD" depending on includeYear.
 */
function formattedDate(date: Dayjs, includeYear=true): string {
  if (includeYear) {
    return date.format('YYYY-MM-DD');
  }

  return date.format('MM-DD');
}

/**
 * 
 * @param offset An offset from today, can be either a positive or negative integer.
 * @returns A "YYYY-MM-DD" formatted date.
 */
export function formattedDateWithOffset(offset: number = 0): string {
  let date = dayjs().add(offset, 'days');
  return formattedDate(date);
}

/**
 * 
 * @param date Any Date object.
 * @returns A "YYYY-MM-DD" formatted date string representation of the provided Date object.
 */
export function dateObjectToFormattedDate(date: Dayjs): string {
  return formattedDate(date);
}

/**
 * 
 * @param YYYYMMDDDate A "YYYY-MM-DD" formatted string.
 * @param offset A offset from the provided date, can be a positive or negative integer.
 * @returns A "YYYY-MM-DD" formatted date string.
 */
export function formattedDateWithOffsetFrom(dateString: string, offset: number = 0): string {
  let date = dayjs(dateString).add(offset, 'days');
  return formattedDate(date);
}

/**
 * 
 * @param offset An offset from today, can be a positive or negative integer.
 * @returns A "MM-DD" formatted date string.
 */
export function formattedDateExcludingYear(offset: number = 0): string {
  let date = dayjs().add(offset, 'days');  
  return formattedDate(date, false);
}

/**
 * 
 * @param dateString A single "YYYY-MM-DD" formatted date string.
 * @returns The provided parameter string reformatted to "MM - DD".
 */
export function removeYearFromDate(dateString: string) : string {
  let [_, month, day] = dateString.split("-");
  return `${ month } - ${ day }`;
}

/**
 * 
 * @param dateStrings An array of "YYYY-MM-DD" formatted dates.
 * @returns A single date which is closest to today.
 */
export function findLatestDate(dateStrings: string[]): string {
  const sortedDates = dateStrings.sort();
  const latestDate = sortedDates[sortedDates.length - 1];

  return latestDate;
}

/**
 * Returns the weight of the closest date to `date`. Only compares
 * to previous dates. Primarily used to detect if the entries
 * detect a weight loss or gain.
 * 
 * @param userData A collection of existing user weight entries
 * @param date The current date we're comparing to.
 */
export function weightOnClosestDateTo(dateToUserData: DateToUserData, targetDate: string): number {
  let datesWithWeight: string[] = Object.keys(dateToUserData);
  if (datesWithWeight.length == 1) {
    return dateToUserData[targetDate].weight_kg;
  }

  // Remove current date, or else it will always be the closest date.
  datesWithWeight.splice(datesWithWeight.indexOf(targetDate), 1)

  const target = dayjs(targetDate);

  const dates = datesWithWeight.map(date => dayjs(date));
  const differences = dates.map(date => Math.abs(target.diff(date, 'day')));
  const minDifferenceIndex = differences.indexOf(Math.min(...differences));

  return dateToUserData[datesWithWeight[minDifferenceIndex]].weight_kg;
}

/**
 * 
 * @param dateStrings An array of "YYYY-MM-DD" formatted dates.
 * @returns A single date which is furtherest from today.
 */
export function findFurtherestDate(dateStrings: string[]): string {
  const sortedDates = dateStrings.sort();
  const latestDate = sortedDates[0];

  return latestDate;
}