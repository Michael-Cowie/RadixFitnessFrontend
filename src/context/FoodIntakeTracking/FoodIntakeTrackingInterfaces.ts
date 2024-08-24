import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

export interface FoodIntakeTrackingContextParameters {
    selectedDate: Dayjs,
    setSelectedDate: (selectedDate: Dayjs) => void
}

export interface Props {
    children: ReactNode;
}