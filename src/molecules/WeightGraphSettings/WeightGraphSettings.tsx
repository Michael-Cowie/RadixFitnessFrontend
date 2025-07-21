import ErrorMessage from 'atoms/ErrorMessage';
import InformationHover from 'atoms/InformationHover';
import WeightTrackingSpinbutton from 'atoms/inputs/weights/WeightTrackingSpinbutton';
import dayjs from 'dayjs';
import { SyntheticEvent, useState } from 'react';
import {
  measurementSystemToUnit,
  weightFromKgToUserMeasurementSystem,
} from 'lib/weightTranslations';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import styles from './styles.module.css';
import { Props } from './WeightGraphSettingsInterfaces';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import CheckBoxWithLabel from 'atoms/design_patterns/CheckBox';
import SensitivityController from 'atoms/design_patterns/SensitivityWrapper';
import ModalForm from 'atoms/design_patterns/ModalForm';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/hooks';
import useProfileContext from 'context/ProfileContext/hooks';

const WeightGraphSettings: React.FC<Props> = ({ closeModalWindow }) => {
  const { measurementSystem } = useProfileContext();

  const {
    ui: {
      trendlineEnabled: defaultTrendlineEnabled,
      goalWeightEnabled: defaultGoalWeightEnabled,
      enableWeightPrediction: defaultEnableWeightPrediction,
    },
    userData: { goalDate: defaultGoalDate, goalWeightKg, hasGoalWeight },
    syncGoalWeight: updateGoalWeight,
    setPartialState,
  } = useWeightTrackingGraphContext();

  const [enableWeightPrediction, setEnableWeightPrediction] = useState<boolean>(
    defaultEnableWeightPrediction,
  );
  const [goalWeightEnabled, setGoalWeightEnabled] = useState<boolean>(defaultGoalWeightEnabled);
  const [goalWeight, setGoalWeight] = useState<number>(
    weightFromKgToUserMeasurementSystem(goalWeightKg, measurementSystem),
  );

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target as HTMLFormElement;

    const trendlineEnabled = (form.elements.namedItem('trendlineEnabled') as HTMLInputElement)
      .checked;

    const goalDatePicker = form.elements.namedItem('goalDateDatePicker') as HTMLInputElement;
    const goalDate = dayjs(goalDatePicker.value);

    const success = await updateGoalWeight(goalDate, goalWeight);
    if (success) {
      setPartialState({
        ui: {
          trendlineEnabled,
          goalWeightEnabled,
          enableWeightPrediction,
        },
      });
      closeModalWindow();
    } else {
      setErrorMessage(`Unable to ${hasGoalWeight ? 'update' : 'add'} goal information`);
      setIsLoading(false);
    }
  };

  return (
    <ModalForm onSubmit={onSubmit} closeModalWindow={closeModalWindow}>
      <GroupContainer>
        <Group title="Display Options">
          <div className="flex flex-col">
            <CheckBoxWithLabel
              label="Goal Weight"
              name="goalWeightEnabled"
              defaultChecked={goalWeightEnabled}
              onChange={() => setGoalWeightEnabled(!goalWeightEnabled)}
            />
            <SensitivityController sensitive={goalWeightEnabled}>
              <div className="flex items-center space-x-1">
                <CheckBoxWithLabel
                  label="Weight Prediction"
                  name="enableWeightPrediction"
                  checked={enableWeightPrediction && goalWeightEnabled}
                  onChange={() => setEnableWeightPrediction(!enableWeightPrediction)}
                />
                <InformationHover information="Predictions are calculated from the visible weights on the graph." />
              </div>
            </SensitivityController>
            <CheckBoxWithLabel
              label="Trendline"
              name="trendlineEnabled"
              defaultChecked={defaultTrendlineEnabled}
            />
          </div>
        </Group>

        <Group title="Goal Settings">
          <div className="mt-1 w-1/2 space-y-2">
            <div className={`w-full ${!goalWeightEnabled ? styles.fadeImage : ''}`}>
              <DatePicker
                name="goalDateDatePicker"
                disabled={!goalWeightEnabled}
                label="Goal Date"
                value={defaultGoalDate}
                minDate={dayjs(new Date()).add(1, 'days')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </div>

            <div className={`${!goalWeightEnabled ? styles.fadeImage : ''}`}>
              <WeightTrackingSpinbutton
                value={goalWeight}
                onChange={setGoalWeight}
                displayUnit={measurementSystemToUnit(measurementSystem)}
                name="goalWeightSpinButton"
                label="Goal Weight"
                disabled={!goalWeightEnabled}
              />
            </div>
          </div>
        </Group>

        <SubmitButton displayLoadingAnimation={isLoading} />
      </GroupContainer>

      <ErrorMessage errorMessage={errorMessage} />
    </ModalForm>
  );
};

export default WeightGraphSettings;
