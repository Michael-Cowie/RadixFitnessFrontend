import ErrorMessage from 'atoms/ErrorMessage';
import InformationHover from 'atoms/InformationHover';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import SelectableButton from 'atoms/SelectableButton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import dayjs, { Dayjs } from 'dayjs';
import { SyntheticEvent, useEffect, useState } from 'react';
import { setGoalWeightOnDate } from 'services/WeightGoal/goalWeightOnDateService';
import { convertKgTo, convertWeight } from 'services/WeightTracking/utils';
import {
    AvailableWeightUnits, availableWeightUnits
} from 'services/WeightTracking/WeightTrackingInterfaces';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import styles from './styles.module.css';
import { Props } from './WeightGraphSettingsInterfaces';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import CheckBox from 'atoms/design_patterns/CheckBox';
import SensitivityController from 'atoms/design_patterns/SensitivityWrapper';
import HorizontalVerticalCenteringContainer from 'atoms/design_patterns/CenterContainer';

const WeightGraphSettings: React.FC<Props> = ({ closeModalWindow }) => {
    const { updatingGoalWeight, isLoading: contextLoaded, setPartialState } = useWeightTrackingGraphContext();
    const weightTrackingGraphContext = useWeightTrackingGraphContext();

    const [displayUnit, setDisplayUnit] = useState<AvailableWeightUnits>("kg");
    const [trendlineEnabled, setTrendlineEnabled] = useState<boolean>(false);
    const [goalWeightEnabled, setGoalWeightEnabled] = useState<boolean>(false);
    const [goalDate, setGoalDate] = useState<Dayjs>(dayjs());
    const [goalWeight, setGoalWeight] = useState<number>(70);
    const [enableWeightPrediction, setEnableWeightPrediction] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const { 
            displayUnit: defaultDisplayUnit, 
            trendlineEnabled: defaultTrendlineEnabled, 
            goalDate: defaultGoalDate, 
            goalWeightKg: defaultGoalWeight, 
            goalWeightEnabled: defaultGoalWeightEnabled,
            enableWeightPrediction: defaultEnableWeightPrediction, 
        } = weightTrackingGraphContext;

        setDisplayUnit(defaultDisplayUnit);
        setTrendlineEnabled(defaultTrendlineEnabled);
        setGoalDate(defaultGoalDate);
        setGoalWeight(convertKgTo(defaultDisplayUnit, defaultGoalWeight));
        setGoalWeightEnabled(defaultGoalWeightEnabled);
        setEnableWeightPrediction(defaultEnableWeightPrediction);
    }, [contextLoaded]);

    const onSubmit = async(event: SyntheticEvent) => {
        event.preventDefault();

        setIsLoading(true);

        const form = event.target as HTMLFormElement;
        const weightInput = parseFloat((form.elements.namedItem('goalWeightSpinButton') as HTMLInputElement).value);
        const goalWeightKg = convertWeight(displayUnit, "kg", weightInput);

        setGoalWeightOnDate(goalDate, goalWeightKg)
            .then((success) => {
                if (success) {                    
                    setPartialState({
                        displayUnit,
                        trendlineEnabled,
                        goalWeightEnabled,
                        goalDate,
                        goalWeightKg,
                        enableWeightPrediction
                    })
                    closeModalWindow();
                } else {
                    setErrorMessage(`Unable to ${ updatingGoalWeight ? 'update' : 'add' } goal information`);
                }

                setIsLoading(false);
            })
    };

    return (
        <dialog id="my_modal" className={"modal modal-open"}>
            <div className="modal-box">
                <HorizontalVerticalCenteringContainer>
                    <form onSubmit={ onSubmit }>
                        <button onClick={ () => closeModalWindow() } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <GroupContainer>
                            <Group title='Weight Units'>
                                <div className="w-full flex flex-row space-x-1">
                                    { availableWeightUnits.map((unit, i) => (
                                        <SelectableButton 
                                            selected={ unit === displayUnit } 
                                            displayText={ unit }
                                            onClick={ () => setDisplayUnit(unit) }
                                            key={ i }
                                        />
                                    )) }
                                </div>
                            </Group>

                            <Group title='Goal Settings'>
                                <div className= { `mt-1 ${ !goalWeightEnabled ? styles.fadeImage : '' }` }>
                                    <DatePicker
                                        name="goalDateDatePicker"
                                        disabled={ !goalWeightEnabled }
                                        label={ "Goal Date"}
                                        value={ goalDate }
                                        minDate={ dayjs(new Date()).add(1, 'days') }
                                        // @ts-ignore - Remove the null type check as we will never receive it.
                                        onChange={ (v: Dayjs) => setGoalDate(v) }
                                    />
                                </div>

                                 <div className= { `${ !goalWeightEnabled ? styles.fadeImage : '' }` }>
                                    <WeightTrackingSpinbutton
                                        defaultValue={ goalWeight }
                                        displayUnit={ displayUnit }
                                        name="goalWeightSpinButton"
                                        label="Goal Weight"
                                        disabled= { !goalWeightEnabled }
                                    />
                                </div>
                            </Group>

                            <Group title='Display Options'>
                                <div className='flex flex-col'>
                                    <CheckBox label='Goal Weight' checked={goalWeightEnabled} onChange={() => setGoalWeightEnabled(!goalWeightEnabled)} />
                                    <CheckBox label='Trendline' checked={trendlineEnabled} onChange={() => setTrendlineEnabled(!trendlineEnabled)} />
                                    <SensitivityController sensitive={goalWeightEnabled }>
                                        <div className='flex items-center space-x-1'>
                                            <CheckBox label='Weight Prediction' checked={ enableWeightPrediction && goalWeightEnabled } onChange={ () => setEnableWeightPrediction(!enableWeightPrediction) }/>
                                            <InformationHover information="Predictions are calculated from the visible weights on the graph."/>
                                        </div>
                                    </SensitivityController>
                                </div>
                            </Group>
                                    
                            <SubmitButton displayLoadingAnimation= { isLoading }/>
                        </GroupContainer>

                        <ErrorMessage errorMessage={ errorMessage } />
                    </form>
                </HorizontalVerticalCenteringContainer>
            </div>
        </dialog>
    );
}

export default WeightGraphSettings;
