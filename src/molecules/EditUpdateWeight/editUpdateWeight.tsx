import ErrorMessage from 'atoms/ErrorMessage';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import dayjs, { Dayjs } from 'dayjs';
import { dateObjectToFormattedDate } from 'lib/dateUtils';
import { SyntheticEvent, useState } from 'react';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    getDefaultValue, getNotesFromDate, getResultsFromForm, getWeightText
} from './editUpdateAlgorithms';
import { Props } from './editUpdateInterfaces';
import useProfileContext from 'context/ProfileContext/ProfileContext';
import { measurementSystemToUnit } from 'lib/weightTranslations';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import ModalForm from 'atoms/design_patterns/ModalForm';

const EditUpdateWeight: React.FC<Props> = ({ closeModalWindow}) => {
    const {
        data: { datesWithWeight, dateToWeightKg },
        syncWeightEntry
    } = useWeightTrackingGraphContext();

    const { measurementSystem }= useProfileContext();

    const today = dayjs(new Date());

    const [date, setDate] = useState<Dayjs>(today);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const formattedDate = dateObjectToFormattedDate(date);
    const updating = datesWithWeight.includes(formattedDate);;

    const onSubmit = async(event: SyntheticEvent) => {
        event.preventDefault();

        const [date, weight, notes] = getResultsFromForm(event, measurementSystem);

        setIsLoading(true);

        syncWeightEntry(date, weight, notes)
            .then(() => {
                closeModalWindow(true);
            })
            .catch(() => {
                setErrorMessage(`Unable to ${ updating ? 'update' : 'add' } weight`);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <ModalForm onSubmit={onSubmit} closeModalWindow={() => closeModalWindow(false)}>
            <GroupContainer>
                <Group title='Entry Details'>
                    <div className='mt-1 w-2/3 space-y-2'>
                        <div className='w-full'>
                            <DatePicker
                                name='datePicker'
                                label={ updating ? `Updating weight on` : `Add weight on` }
                                defaultValue={ today }
                                maxDate={ today }
                                // @ts-ignore - Remove the null type check as we will never receive it.
                                onChange={ (v: Dayjs) => setDate(v) }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </div>

                        <WeightTrackingSpinbutton 
                            defaultValue={ getDefaultValue(measurementSystem, datesWithWeight, dateToWeightKg) }
                            displayUnit={ measurementSystemToUnit(measurementSystem) }
                            name={ "weightInput" }
                            label={ getWeightText(updating, formattedDate, measurementSystem) }
                        />
                    </div>

                    <TextField
                        id="notesTextArea"
                        className="resize-none w-full" 
                        defaultValue={ getNotesFromDate(formattedDate) }
                        placeholder="Optional notes"
                        label="Notes"
                        variant="outlined" 
                        multiline
                        rows={3}
                    />

                    <SubmitButton displayLoadingAnimation= { isLoading }/>
                </Group>
            </GroupContainer>

            <ErrorMessage errorMessage={ errorMessage } />
        </ModalForm>
    );
}

export default EditUpdateWeight;
