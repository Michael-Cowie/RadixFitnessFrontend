import dayjs, { Dayjs } from 'dayjs';
import { createContext, useContext, useState } from 'react';

import { FoodIntakeTrackingContextParameters, Props } from './FoodIntakeTrackingInterfaces';

const FoodIntakeTrackingContext = createContext<FoodIntakeTrackingContextParameters>({
    selectedDate: dayjs(),
    setSelectedDate: () => null
});

export const FoodIntakeTrackingContextComponent: React.FC<Props> = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    return (
        <FoodIntakeTrackingContext.Provider value={ { selectedDate, setSelectedDate } } >
            { children }
        </FoodIntakeTrackingContext.Provider>
    )
}

const useFoodIntakeTrackingContext = () => {
    return useContext(FoodIntakeTrackingContext);
}

export default useFoodIntakeTrackingContext;