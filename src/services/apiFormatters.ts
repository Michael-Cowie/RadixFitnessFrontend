import { Dayjs } from 'dayjs';

export const formatDayjsForApi = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};
