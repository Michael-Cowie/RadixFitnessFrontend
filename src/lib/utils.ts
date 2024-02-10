export function YYYYMMDDFormattedDate(offset: number = 0): string {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  
  return date.toISOString().split('T')[0]
}
  
export function MMDDFormattedDate(offset: number = 0): string {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  const [_, month, day] = date.toISOString().split('T')[0].split('-');
    
  return `${month} - ${day}`;
}

export function findLatestDate(dateStrings: string[]): string {
  const sortedDates = dateStrings.sort();
  const latestDate = sortedDates[sortedDates.length - 1];

  return latestDate;
}

export function findFurtherestDate(dateStrings: string[]): string {
  const sortedDates = dateStrings.sort();
  const latestDate = sortedDates[0];

  return latestDate;
}