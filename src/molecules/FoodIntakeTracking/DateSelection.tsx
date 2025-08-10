import { Button, Stack, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Dayjs } from 'dayjs';

import EditCalendarIconDatePicker from 'atoms/EditCalenderIconDatePicker';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import SensitivityController from 'atoms/design_patterns/SensitivityWrapper';
import SelectableButton from 'atoms/SelectableButton';
import {
  DayView,
  WeeklySummaryView,
} from 'context/FoodIntakeTracking/FoodIntakeTrackingInterfaces';
import { isDayView, isWeeklySummaryView } from 'context/FoodIntakeTracking/FoodIntakeTrackingUtils';
import { getTodayDayjs } from 'lib/dateUtils';

const getStartOfWeek = (date: Dayjs) => date.startOf('week');
const isSameDay = (a: Dayjs, b: Dayjs) => a.isSame(b, 'day');

export default function DateSelector() {
  const today = getTodayDayjs();

  const { selectedView, setSelectedView, weekStart, setWeekStart } = useFoodIntakeTrackingContext();

  const handlePrevWeek = () => {
    setWeekStart(weekStart.subtract(7, 'day'));
    if (isDayView(selectedView)) {
      setSelectedView({ type: 'day', day: selectedView.day.subtract(7, 'day') } as DayView);
    }
  };
  const handleNextWeek = () => {
    setWeekStart(weekStart.add(7, 'day'));
    if (isDayView(selectedView)) {
      setSelectedView({ type: 'day', day: selectedView.day.add(7, 'day') } as DayView);
    }
  };

  const handleCalendarSelect = (selectedDate: Dayjs) => {
    setSelectedView({ type: 'day', day: selectedDate } as DayView);
    setWeekStart(getStartOfWeek(selectedDate));
  };

  const daysOfWeek = [...Array(7)].map((_, i) => weekStart.add(i, 'day'));

  return (
    <Stack alignItems="center" className="mb-2">
      <Stack direction="row" alignItems="center">
        <EditCalendarIconDatePicker onDateSelection={handleCalendarSelect} />

        <IconButton onClick={handlePrevWeek}>
          <ChevronLeft color="primary" />
        </IconButton>

        <Typography>
          {weekStart.format('MMM D')} – {weekStart.add(6, 'day').format('MMM D')}
        </Typography>

        <IconButton onClick={handleNextWeek}>
          <ChevronRight color="primary" />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
        {daysOfWeek.map((dayOfWeek) => {
          const isSelected = isDayView(selectedView) && isSameDay(dayOfWeek, selectedView.day);

          return (
            <SensitivityController key={dayOfWeek.toString()} sensitive={dayOfWeek.isBefore(today)}>
              <Stack alignItems="center">
                <Typography variant="caption">{dayOfWeek.format('ddd')}</Typography>

                <Button
                  variant={isSelected ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedView({ type: 'day', day: dayOfWeek } as DayView);
                  }}
                  sx={{
                    borderRadius: '40px',
                    borderWidth: '2px',
                    width: 40,
                    height: 40,
                    minWidth: 0,
                    p: 0,
                    color: isSelected ? 'white' : 'text.primary',
                  }}
                >
                  {dayOfWeek.format('D')}
                </Button>
              </Stack>
            </SensitivityController>
          );
        })}
      </Stack>

      <div className="flex justify-center items-center m-2">
        <SelectableButton
          selected={isWeeklySummaryView(selectedView)}
          displayText="Weekly Summary"
          onClick={() => {
            setSelectedView({ type: 'weeklySummary' } as WeeklySummaryView);
          }}
        />
      </div>
    </Stack>
  );
}
