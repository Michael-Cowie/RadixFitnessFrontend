import { useState } from 'react';
import { Button, Stack, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

import EditCalendarIconDatePicker from 'atoms/EditCalenderIconDatePicker';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import SensitivityController from 'atoms/design_patterns/SensitivityWrapper';

const getStartOfWeek = (date: Dayjs) => date.startOf('week');
const isSameDay = (a: Dayjs, b: Dayjs) => a.isSame(b, 'day');

export default function DateSelector() {
  const today = dayjs();

  const { selectedDate, setSelectedDate } = useFoodIntakeTrackingContext();

  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(today));

  const handlePrevWeek = () => setStartOfWeek(startOfWeek.subtract(7, 'day'));
  const handleNextWeek = () => setStartOfWeek(startOfWeek.add(7, 'day'));

  const handleCalendarSelect = (selectedDate: Dayjs) => {
    setSelectedDate(selectedDate);
    setStartOfWeek(getStartOfWeek(selectedDate));
  };

  const daysOfWeek = [...Array(7)].map((_, i) => startOfWeek.add(i, 'day'));

  return (
    <Stack alignItems="center" className="mb-2">
      <Stack direction="row" alignItems="center">
        <EditCalendarIconDatePicker onDateSelection={handleCalendarSelect} />

        <IconButton onClick={handlePrevWeek}>
          <ChevronLeft color="primary" />
        </IconButton>

        <Typography>
          {startOfWeek.format('MMM D')} – {startOfWeek.add(6, 'day').format('MMM D')}
        </Typography>

        <IconButton onClick={handleNextWeek}>
          <ChevronRight color="primary" />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={2}>
        {daysOfWeek.map((day) => {
          const isSelected = isSameDay(day, selectedDate);

          return (
            <SensitivityController key={day.toString()} sensitive={day.isBefore(today)}>
              <Stack alignItems="center">
                <Typography variant="caption">{day.format('ddd')}</Typography>

                <Button
                  variant={isSelected ? 'contained' : 'outlined'}
                  onClick={() => setSelectedDate(day)}
                  sx={{
                    borderRadius: '40px',
                    width: 40,
                    height: 40,
                    minWidth: 0,
                    p: 0,
                    color: isSelected ? 'white' : 'text.primary',
                  }}
                >
                  {day.format('D')}
                </Button>
              </Stack>
            </SensitivityController>
          );
        })}
      </Stack>
    </Stack>
  );
}
