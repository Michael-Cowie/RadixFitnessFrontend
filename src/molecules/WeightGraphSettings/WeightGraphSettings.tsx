import ErrorMessage from 'atoms/ErrorMessage';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import LoadingButton from 'atoms/LoadingButton';
import SelectableButton from 'atoms/SelectableButton';
import dayjs, { Dayjs } from 'dayjs';
import { SyntheticEvent, useState } from 'react';
import { AvailableWeightUnits } from 'services/WeightTracking/WeightTrackingInterfaces';
import styled from 'styled-components';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Props } from './WeightGraphSettingsInterfaces';

const availableUnits: AvailableWeightUnits[] = ['kg', 'lbs'];

const WeightGraphSettings: React.FC<Props> = ({ displayUnit, onSuccess, closeModalWindow}) => {
    const [trendLineEnabled, setTrendLineEnabled] = useState<boolean>(false); // TODO

    const [settingsDisplayUnit, setSettingsDisplayUnit] = useState<AvailableWeightUnits>(displayUnit); // Keep default to settings

    const [enableGoalSettings, setEnableGoalSettings] = useState<boolean>();     // TODO
    const [goalDate, setGoalDate] = useState<Dayjs>(dayjs(new Date()).add(7));   // TODO
    const [goalWeight, setGoalWeight] = useState<number>(100);                   // TODO
    const [enableWeightPrediction, setEnableWeightPrediction] = useState(false); // TODO

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async(event: SyntheticEvent) => {
        event.preventDefault();
    };

    return (
        <dialog id="my_modal" className={"modal modal-open"}>
            <div className="modal-box h-full">
                <FormContainer>
                    <form onSubmit={ onSubmit }>
                        <button onClick={ () => closeModalWindow() } className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>

                        <div className="mt-3 w-full flex justify-center font-bold">
                            <h1> Select a display unit </h1>
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            { availableUnits.map((unit, i) => (
                                <SelectableButton 
                                    selected={ unit === settingsDisplayUnit } 
                                    displayText={ unit }
                                    onClick={ () => setSettingsDisplayUnit(unit) }
                                    key={ i }
                                />
                            )) }
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            <span className="mr-2 font-bold"> Enable trendline </span>
                            <input 
                                className="focus:ring-0"
                                type="checkbox"
                                checked={ trendLineEnabled }
                                onChange={ () => setTrendLineEnabled(!trendLineEnabled) }
                            />
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            <span className="mr-2 font-bold"> Enable goal settings </span>
                            <input 
                                className="focus:ring-0"
                                type="checkbox"
                                checked={ enableGoalSettings }
                                onChange={ () => setEnableGoalSettings(!enableGoalSettings) }
                            />
                        </div>

                        <div className="flex w-full mt-5 items-center justify-center">
                            <div className="mb-5">
                                <DatePicker
                                    disabled={ !enableGoalSettings }
                                    className='w-48'
                                    label={ "Goal Date"}
                                    defaultValue={ goalDate }
                                    // @ts-ignore - Remove the null type check as we will never receive it.
                                    onChange={ (v: Dayjs) => setDate(v) }
                                />
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-center">
                            <WeightTrackingSpinbutton
                                defaultValue={ goalWeight }
                                displayUnit={ displayUnit }
                                name={"goalWeight" }
                                label="Goal Weight"
                                disabled= { !enableGoalSettings }
                            />
                        </div>


                        <div className="w-full flex justify-center items-center">
                            <span className={ `mr-1 font-bold ${ !enableGoalSettings ? 'text-gray-500' : ''}` }> Enable weight prediction </span>
                            <img className="mr-2 h-3 w-3" src="information-icon.svg" title="Predictions are calculated from the selected date range." />
                            <input
                                disabled= { !enableGoalSettings }
                                className="focus:ring-0"
                                type="checkbox"
                                defaultChecked={ enableWeightPrediction }
                                // checked={ enableWeightPrediction }
                                // onChange={ () => setEnableWeightPrediction(!enableWeightPrediction) }
                            />
                        </div>

                        <div className="w-100 mt-5 flex justify-center items-center">
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