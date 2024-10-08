import useAuthContext from 'context/AuthContext/AuthContext';
import { createContext, useContext, useEffect, useState } from 'react';
import { WeightGoal } from 'services/WeightGoal/goalWeightOnDateInterface';
import { getGoalWeightOnDate } from 'services/WeightGoal/goalWeightOnDateService';
import { getAllWeights } from 'services/WeightTracking/WeightTrackingService';

import useProfileContext from '../ProfileContext/ProfileContext';
import {
    createDefaultState, gatherDateInformation, getLocalStorage, localStorageKeys, setLocalStorage
} from './WeightTrackingGraphContextAlgorithms';
import { Props, WeightTrackingGraphContext } from './WeightTrackingGraphContextInterfaces';

const WeightTrackingGraphContextProvider = createContext<WeightTrackingGraphContext>(createDefaultState("Metric"));

export const WeightTrackingGraphContextComponent: React.FC<Props> = ({ children }) => {
    const { user } = useAuthContext();

    // @ts-ignore
    // By getting here, a user must be set by the auth context.
    const user_uid = user.uid;

    const { measurementSystem } = useProfileContext();

    const [state, setState] = useState<WeightTrackingGraphContext>(createDefaultState(measurementSystem));

    const setPartialState = (partialState: Partial<WeightTrackingGraphContext>) => {
        localStorageKeys.forEach((localStorageKey) => {
            if (localStorageKey in partialState) {
              setLocalStorage(localStorageKey, user_uid, partialState[localStorageKey] as boolean);
            }
        });

        setState((prevState) => ({ ...prevState, ...partialState }));
    };

    useEffect(() => {
        Promise.all([getAllWeights(), getGoalWeightOnDate()]).then((result) => {
          const [dateToWeightKg, dateToNotes, datesWithWeight] = gatherDateInformation(result[0]);
      
          setPartialState({
            dateToWeightKg,
            dateToNotes,
            datesWithWeight,
          });
      
          const goalWeight: WeightGoal | null = result[1];
          if (goalWeight) {
            setPartialState({
              goalDate: goalWeight.goalDate,
              goalWeightKg: goalWeight.goalWeightKg,
              updatingGoalWeight: true,
            });
          }
          
          const restoredLocalStorage = localStorageKeys.reduce((acc, key) => {
            const value = getLocalStorage(key, user_uid);
            if (value !== null) {
              acc[key] = value;
            }
            return acc;
          }, {} as Partial<WeightTrackingGraphContext>);

          setPartialState(restoredLocalStorage);
      
          setPartialState({
            isLoading: false
          })
        });
      }, []);

    return (
        <WeightTrackingGraphContextProvider.Provider value={{ ...state, setPartialState }} >
            { children }
        </WeightTrackingGraphContextProvider.Provider>
    )
}

const useWeightTrackingGraphContext = () => {
    return useContext(WeightTrackingGraphContextProvider);
}

export default useWeightTrackingGraphContext;
