export function convertToUnit(unit: string, weight: string): string {
  if (unit === 'lbs') {
    const kg_to_lbs = 2.20462;
    return String(Number(weight) * kg_to_lbs);
  }
  return weight;
}
 
  
export function YYYY_MM_DD_formattedDate(offset: number = 0): string {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  
  return date.toISOString().split('T')[0]
}
  
export function MM_DD_formatteDate(offset: number = 0): string {
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