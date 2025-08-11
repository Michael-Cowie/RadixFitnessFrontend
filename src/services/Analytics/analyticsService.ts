import dayjs, { Dayjs } from 'dayjs';
import { formatDayjsForApi } from 'services/apiFormatters';
import { get } from 'services/DataService';
import { MacronutrientAnalyticsSummary } from './analyticsServiceInterfaces';

const ANALYTICS_END_POINT = '/api/v1/analytics/';
const ANALYTICS_MACRONUTRIENT_SUMMARY_END_POINT = ANALYTICS_END_POINT + 'macronutrients/summary';

export const getWeekLongMacronutrientSummary = async (
  startDate: Dayjs,
): Promise<MacronutrientAnalyticsSummary> => {
  const endDate = startDate.add(6, 'days');

  const response = await get(ANALYTICS_MACRONUTRIENT_SUMMARY_END_POINT, {
    start: formatDayjsForApi(startDate),
    end: formatDayjsForApi(endDate),
  });

  if (response.status === 200) {
    return {
      ...response.data,
      startDate: dayjs(response.data.startDate),
      endDate: dayjs(response.data.endDate),
    };
  }

  throw new Error('Unexpected response status for getWeekLongSummary');
};
