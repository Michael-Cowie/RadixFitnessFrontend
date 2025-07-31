import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
  onDateSelection: (selectedDate: Dayjs) => void;
}

const EditCalendarIconDatePicker: React.FC<Props> = ({ onDateSelection }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [open, setOpen] = useState(false);

  const handleDateChange = (date: Dayjs | null) => {
    if (date !== null) {
      setSelectedDate(date);
      onDateSelection(date);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} id="calendar-icon-button">
        <EditCalendarIcon color="primary" />
      </IconButton>

      <DatePicker
        open={open}
        onClose={() => setOpen(false)}
        value={selectedDate}
        onAccept={handleDateChange}
        maxDate={dayjs()}
        slotProps={{
          popper: {
            anchorEl: document.getElementById('calendar-icon-button'), // Anchor the position to be at the Icon
            placement: 'bottom-start',
          },
          textField: {
            InputProps: { style: { display: 'none' } }, // Hide the input field
          },
        }}
      />
    </>
  );
};

export default EditCalendarIconDatePicker;
