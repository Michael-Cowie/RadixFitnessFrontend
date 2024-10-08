
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import { IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
    onDateSelection: (selectedDate: Dayjs) => void;
}

const EditCalendarIconDatePicker: React.FC<Props> = ({ onDateSelection }) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [open, setOpen] = useState(false);

    const handleDateChange = (date: Dayjs) => {
        setSelectedDate(date);
        onDateSelection(date);
    };

    return (
        <>
            <IconButton 
                onClick={() => setOpen(true)}
                id="calendar-icon-button"
            >
                <EditCalendarTwoToneIcon/>
            </IconButton>

            <DatePicker
                open={open}
                onClose={() => setOpen(false)}
                value={selectedDate}
                // @ts-ignore
                onAccept={ handleDateChange }
                slotProps={{
                    popper: {
                        anchorEl: document.getElementById('calendar-icon-button'), // Anchor the position to be at the Icon
                        placement: 'bottom-start'
                    },
                    textField: {
                        InputProps: { style: { display: 'none' } }, // Hide the input field
                    },
                }}
            />
        </>
    );
};

export default EditCalendarIconDatePicker