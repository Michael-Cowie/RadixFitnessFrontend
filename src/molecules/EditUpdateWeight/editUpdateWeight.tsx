import ErrorMessage from 'atoms/ErrorMessage';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import dayjs, { Dayjs } from 'dayjs';
import { dateObjectToFormattedDate } from 'lib/dateUtils';
import { useEffect, useState, SyntheticEvent } from 'react';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getDefaultValue, getNotesFromDate, getWeightText } from './editUpdateAlgorithms';

import { Props } from './editUpdateInterfaces';
import { measurementSystemToUnit } from 'lib/weightTranslations';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import ModalForm from 'atoms/design_patterns/ModalForm';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/hooks';
import useProfileContext from 'context/ProfileContext/hooks';

const EditUpdateWeight: React.FC<Props> = ({ closeModalWindow }) => {
  const {
    data: { datesWithWeight, dateToWeightKg, dateToNotes },
    syncWeightEntry,
  } = useWeightTrackingGraphContext();

  const { measurementSystem } = useProfileContext();
  const today = dayjs();

  const [date, setDate] = useState<Dayjs>(today);
  const [weight, setWeight] = useState<number>(
    getDefaultValue(
      dateObjectToFormattedDate(date),
      measurementSystem,
      datesWithWeight,
      dateToWeightKg,
    ),
  );
  const [notes, setNotes] = useState<string>(
    getNotesFromDate(dateObjectToFormattedDate(today), dateToNotes),
  );

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formattedDate = dateObjectToFormattedDate(date);
  const updating = datesWithWeight.includes(formattedDate);

  useEffect(() => {
    const formattedDate = dateObjectToFormattedDate(date);
    setWeight(getDefaultValue(formattedDate, measurementSystem, datesWithWeight, dateToWeightKg));
    setNotes(getNotesFromDate(formattedDate, dateToNotes));
  }, [date, dateToNotes, dateToWeightKg, datesWithWeight, measurementSystem]);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    syncWeightEntry(date, weight, notes)
      .then(() => closeModalWindow(true))
      .catch(() => setErrorMessage(`Unable to ${updating ? 'update' : 'add'} weight`))
      .finally(() => setIsLoading(false));
  };

  return (
    <ModalForm onSubmit={onSubmit} closeModalWindow={() => closeModalWindow(false)}>
      <GroupContainer>
        <Group title="Entry Details">
          <div className="mt-1 w-2/3 space-y-2">
            <div className="w-full mb-1">
              <DatePicker
                name="datePicker"
                label={updating ? 'Updating weight on' : 'Add weight on'}
                defaultValue={today}
                maxDate={today}
                onChange={(v: Dayjs | null) => v && setDate(v)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </div>

            <WeightTrackingSpinbutton
              value={weight}
              onChange={setWeight}
              displayUnit={measurementSystemToUnit(measurementSystem)}
              name="weightInput"
              label={getWeightText(updating, formattedDate, measurementSystem, dateToWeightKg)}
            />
          </div>

          <TextField
            className="resize-none w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
            label="Notes"
            variant="outlined"
            multiline
            rows={3}
          />

          <SubmitButton displayLoadingAnimation={isLoading} />
        </Group>
      </GroupContainer>

      <ErrorMessage errorMessage={errorMessage} />
    </ModalForm>
  );
};

export default EditUpdateWeight;
