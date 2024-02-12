export function YYYYMMDDFormattedDate(offset: number = 0): string {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  
  return date.toISOString().split('T')[0]
}

export function YYYYMMDDDateWithOffset(YYYYMMDDDate: string, offset: number = 0): string {
  let date = new Date(YYYYMMDDDate);
  date.setDate(date.getDate() + offset);
  
  return date.toISOString().split('T')[0]
}
  
export function MMDDFormattedDate(offset: number = 0): string {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  const [_, month, day] = date.toISOString().split('T')[0].split('-');
    
  return `${month} - ${day}`;
}

export function YYYYMMDDToMMDD(YYYYMMDDDate: string) : string {
  let [year, month, day] = YYYYMMDDDate.split("-");
  return `${month} - ${day}`;
}