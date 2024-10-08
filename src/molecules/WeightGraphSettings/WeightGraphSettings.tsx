import ErrorMessage from 'atoms/ErrorMessage';
import InformationHover from 'atoms/InformationHover';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import LoadingButton from 'atoms/LoadingButton';
import SelectableButton from 'atoms/SelectableButton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import dayjs, { Dayjs } from 'dayjs';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
    createGoalWeightOnDate, updateGoalWeightOnDate
} from 'services/WeightGoal/goalWeightOnDateService';
import { convertKgTo, convertWeight } from 'services/WeightTracking/utils';
import {
    AvailableWeightUnits, availableWeightUnits
} from 'services/WeightTracking/WeightTrackingInterfaces';
import styled from 'styled-components';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import styles from './styles.module.css';
import { Props } from './WeightGraphSettingsInterfaces';

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

        const apiCall = updatingGoalWeight ? updateGoalWeightOnDate : createGoalWeightOnDate
        apiCall(goalDate, goalWeightKg)
            .then((success) => {
                /**
                 * Once the API call has been successful, keep track of the user UI setup.
                 */
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
                <FormContainer>
                    <form onSubmit={ onSubmit } className="w-80">
                        <button onClick={ () => closeModalWindow() } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <div className="mt-3 w-full flex justify-center font-bold">
                            <h1> Select a display unit </h1>
                        </div>

                        <div className="mt-3 w-full flex flex-row justify-center">
                            { availableWeightUnits.map((unit, i) => (
                                <SelectableButton 
                                    selected={ unit === displayUnit } 
                                    displayText={ unit }
                                    onClick={ () => setDisplayUnit(unit) }
                                    key={ i }
                                />
                            )) }
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            <span className="mr-2 font-bold"> Trendline </span>
                            <input 
                                className="focus:ring-0"
                                type="checkbox"
                                checked={ trendlineEnabled }
                                onChange={ _ => setTrendlineEnabled(!trendlineEnabled)}
                            />
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            <span className="mr-2 font-bold"> Goal weight  </span>
                            <input 
                                className="focus:ring-0"
                                type="checkbox"
                                checked={ goalWeightEnabled }
                                onChange={ _ => setGoalWeightEnabled(!goalWeightEnabled) }
                            />
                        </div>

                        <div className= { `flex w-full mt-3 items-center justify-center ${ !goalWeightEnabled ? styles.fadeImage : '' }` }>
                            <div className="mb-5">
                                <DatePicker
                                    name="goalDateDatePicker"
                                    disabled={ !goalWeightEnabled }
                                    className='w-48'
                                    label={ "Goal Date"}
                                    value={ goalDate }
                                    minDate={ dayjs(new Date()).add(1, 'days') }
                                    // @ts-ignore - Remove the null type check as we will never receive it.
                                    onChange={ (v: Dayjs) => setGoalDate(v) }
                                />
                            </div>
                        </div>

                        <div className= { `flex items-center justify-center ${ !goalWeightEnabled ? styles.fadeImage : '' }` }>
                            <WeightTrackingSpinbutton
                                defaultValue={ goalWeight }
                                displayUnit={ displayUnit }
                                name="goalWeightSpinButton"
                                label="Goal Weight"
                                disabled= { !goalWeightEnabled }
                            />
                        </div>

                        <div className="w-full flex justify-center items-center">
                            <span className={ `mr-1 font-bold ${ !goalWeightEnabled ? styles.fadeImage : ''}` }> Weight prediction </span>
                            <InformationHover information="Predictions are calculated from the visible weights on the graph." faded={ !goalWeightEnabled }/>
                            <input
                                disabled= { !goalWeightEnabled }
                                className="focus:ring-0"
                                type="checkbox"
                                checked={ enableWeightPrediction }
                                onChange={ () => setEnableWeightPrediction(!enableWeightPrediction) }
                            />
                        </div>

                        <div className="w-100 mt-3 flex justify-center items-center">
                            <div className="w-40">
                                <LoadingButton
                                    buttonText="Submit"
                                    displayLoadingAnimation={ isLoading }
                                />
                            </div>
                        </div>
                    </form>
                    <ErrorMessage errorMessage={ errorMessage } />
                </FormContainer>
            </div>
        </dialog>
    );
}

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default WeightGraphSettings;
