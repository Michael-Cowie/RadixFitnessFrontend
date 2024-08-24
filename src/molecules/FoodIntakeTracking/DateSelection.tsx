import CircularBox from 'atoms/circularbox/CircularBox';
import EditCalendarIconDatePicker from 'atoms/EditCalenderIconDatePicker';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import { useEffect, useState } from 'react';

import { Offset } from './DailyMacroNutrientInterfaces';

const get_DD = (offset: number): string => {
    const { selectedDate } = useFoodIntakeTrackingContext();

    return selectedDate.subtract(offset, 'days').format("DD");
}

const get_ddd = (offset: number): string => {
    const { selectedDate } = useFoodIntakeTrackingContext();

    return selectedDate.subtract(offset, 'days').format("ddd");
}

const SelectedCircularBox: React.FC<Offset> = ({  offset }) => {
    const { setSelectedDate } = useFoodIntakeTrackingContext();

    return (
        <div className="flex flex-col items-center justify-center">
            <EditCalendarIconDatePicker onDateSelection={ setSelectedDate }/>
            <CircularBox number={ get_DD(offset) } text={ get_ddd(offset) } selected={ true }/>
        </div>
    )
}

const UnselectedCircularBox: React.FC<Offset> = ({ offset }) => {
    return (
        <div className="flex items-end">
            <CircularBox number={ get_DD(offset) } text={ get_ddd(offset) } selected={ false }/>
        </div>
    )
}

const DateSelection = () => {
    const [numBoxes, setNumBoxes] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setNumBoxes(4);
            } else {
                setNumBoxes(5);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    let date_buttons = [];
    for (let offset = 0; offset < numBoxes; offset++) {
        if (offset === 0) {
            date_buttons.push(<SelectedCircularBox offset={ offset } key={ offset }/>)
        } else {
            date_buttons.push(<UnselectedCircularBox offset={ offset } key={ offset }/>);
        }
    };
    date_buttons.reverse();

    return (
        <div className="flex flex-row justify-between mb-2">
            { date_buttons }
        </div>
    )
}

export default DateSelection;