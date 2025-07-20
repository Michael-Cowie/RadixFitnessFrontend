import { createContext, useCallback, useEffect, useState } from 'react';
import {
  getGoalWeightOnDate,
  saveGoalWeightKgOnDate,
} from 'services/WeightGoal/goalWeightOnDateService';
import { getAllWeights, saveWeightEntry } from 'services/WeightTracking/WeightTrackingService';

import {
  DefaultWeightTrackingGraphContext,
  gatherDateInformation,
  getLocalStorage,
  setLocalStorage,
  userInterfaceLocalStorageKeys,
} from './WeightTrackingGraphContextAlgorithms';
import {
  Props,
  WeightTrackingGraphContext,
  WeightTrackingGraphContextPartial,
  WeightTrackingUIPartial,
} from './WeightTrackingGraphContextInterfaces';
import { Dayjs } from 'dayjs';
import { weightFromUserMeasurementSystemtoKg } from 'lib/weightTranslations';
import { formatDayjsForApi } from 'services/apiFormatters';
import useProfileContext from 'context/ProfileContext/hooks';
import useAuthContext from 'context/AuthContext/hooks';

export const WeightTrackingGraphContextProvider = createContext<WeightTrackingGraphContext>(
  DefaultWeightTrackingGraphContext,
);

export const WeightTrackingGraphContextComponent: React.FC<Props> = ({ children }) => {
  const { user } = useAuthContext();
  const { measurementSystem } = useProfileContext();

  // @ts-expect-error User is guaranteed to be logged in.
  const user_uid = user.uid;

  const [state, setState] = useState<WeightTrackingGraphContext>(DefaultWeightTrackingGraphContext);

  const setPartialState = useCallback(
    (partialState: WeightTrackingGraphContextPartial) => {
      if (partialState.ui) {
        const uiState = partialState.ui;

        userInterfaceLocalStorageKeys.forEach((userInterfaceLocalStorageKey) => {
          if (userInterfaceLocalStorageKey in uiState) {
            setLocalStorage(
              userInterfaceLocalStorageKey,
              user_uid,
              uiState[userInterfaceLocalStorageKey] as boolean,
            );
          }
        });
      }

      setState((prevState) => ({
        ...prevState,
        ...partialState,
        ui: {
          ...prevState.ui,
          ...(partialState.ui || {}),
        },
        userData: {
          ...prevState.userData,
          ...(partialState.userData || {}),
        },
        data: {
          ...prevState.data,
          ...(partialState.data || {}),
        },
      }));
    },
    [user_uid],
  );

  const syncGoalWeight = async (goalDate: Dayjs, weightInUserUnit: number): Promise<boolean> => {
    const weightKg = weightFromUserMeasurementSystemtoKg(weightInUserUnit, measurementSystem);

    setPartialState({
      ui: {
        isLoading: true,
      },
    });

    const success = await saveGoalWeightKgOnDate(goalDate, weightKg);
    if (success) {
      setPartialState({
        userData: {
          goalDate,
          goalWeightKg: weightKg,
          hasGoalWeight: true,
        },
      });
    }

    setPartialState({
      ui: {
        isLoading: false,
      },
    });

    return success;
  };

  const syncWeightEntry = async (
    date: Dayjs,
    weightInUserUnit: number,
    notes: string,
  ): Promise<boolean> => {
    const formattedDate = formatDayjsForApi(date);
    const weightKg = weightFromUserMeasurementSystemtoKg(weightInUserUnit, measurementSystem);

    const success = await saveWeightEntry(formattedDate, weightKg, notes);
    if (success) {
      const {
        data: { dateToWeightKg, dateToNotes, datesWithWeight },
      } = state;

      dateToWeightKg[formattedDate] = weightKg;
      dateToNotes[formattedDate] = notes;
      if (!datesWithWeight.includes(formattedDate)) {
        datesWithWeight.push(formattedDate);
      }

      setPartialState({
        data: {
          dateToWeightKg,
          dateToNotes,
          datesWithWeight,
        },
      });
    }
    return success;
  };

  useEffect(() => {
    Promise.all([getAllWeights(), getGoalWeightOnDate()]).then(([allWeights, goalWeight]) => {
      const [dateToWeightKg, dateToNotes, datesWithWeight] = gatherDateInformation(allWeights);

      setPartialState({
        ui: {
          isLoading: false,
        },
        data: {
          dateToWeightKg,
          dateToNotes,
          datesWithWeight,
        },
      });

      if (goalWeight) {
        setPartialState({
          userData: {
            goalDate: goalWeight.goalDate,
            goalWeightKg: goalWeight.goalWeightKg,
          },
        });
      }

      const restoredUserInterfaceState = userInterfaceLocalStorageKeys.reduce(
        (acc, uiStateKey) => {
          const uiState = getLocalStorage(uiStateKey, user_uid);

          if (uiState !== null) {
            // @ts-expect-error TODO Improve typing for this later on.
            acc.ui[uiStateKey] = uiState as boolean;
          }
          return acc;
        },
        {
          ui: {},
        } as WeightTrackingUIPartial,
      );

      setPartialState(restoredUserInterfaceState);
    });
  }, [setPartialState, user_uid]);

  return (
    <WeightTrackingGraphContextProvider.Provider
      value={{
        ...state,
        setPartialState,
        syncGoalWeight,
        syncWeightEntry,
      }}
    >
      {children}
    </WeightTrackingGraphContextProvider.Provider>
  );
};
