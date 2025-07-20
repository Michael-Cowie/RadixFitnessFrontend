import CircularBox from 'atoms/circularbox/CircularBox';
import EditCalendarIconDatePicker from 'atoms/EditCalenderIconDatePicker';
import { useEffect, useState } from 'react';

import { Dayjs } from 'dayjs';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';

const SelectedCircularBox: React.FC<{
  dayStr: string;
  dayNameStr: string;
  onDateSelect: (selectedDate: Dayjs) => void;
}> = ({ dayStr, dayNameStr, onDateSelect }) => (
  <div className="flex flex-col items-center justify-center">
    <EditCalendarIconDatePicker onDateSelection={onDateSelect} />
    <CircularBox number={dayStr} text={dayNameStr} selected={true} />
  </div>
);

const UnselectedCircularBox: React.FC<{ dayStr: string; dayNameStr: string }> = ({
  dayStr,
  dayNameStr,
}) => (
  <div className="flex items-end">
    <CircularBox number={dayStr} text={dayNameStr} selected={false} />
  </div>
);

const DateSelection = () => {
  const { selectedDate, setSelectedDate } = useFoodIntakeTrackingContext();
  const [numBoxes, setNumBoxes] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setNumBoxes(window.innerWidth < 640 ? 4 : 5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const date_buttons = [];

  for (let offset = 0; offset < numBoxes; offset++) {
    const dayStr = selectedDate.subtract(offset, 'days').format('DD');
    const dayNameStr = selectedDate.subtract(offset, 'days').format('ddd');

    if (offset === 0) {
      date_buttons.push(
        <SelectedCircularBox
          key={offset}
          dayStr={dayStr}
          dayNameStr={dayNameStr}
          onDateSelect={setSelectedDate}
        />,
      );
    } else {
      date_buttons.push(
        <UnselectedCircularBox key={offset} dayStr={dayStr} dayNameStr={dayNameStr} />,
      );
    }
  }

  date_buttons.reverse();

  return <div className="flex flex-row justify-between mb-2">{date_buttons}</div>;
};

export default DateSelection;
