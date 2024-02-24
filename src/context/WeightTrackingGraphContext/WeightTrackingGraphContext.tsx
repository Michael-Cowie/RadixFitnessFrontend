import { createContext, useContext, useEffect, useState } from 'react';
import { WeightGoal } from 'services/WeightGoal/goalWeightOnDateInterface';
import { getGoalWeightOnDate } from 'services/WeightGoal/goalWeightOnDateService';
import { getAllWeights } from 'services/WeightTracking/WeightTracking';

import useProfileContext from '../ProfileContext';
import {
    createDefaultState, gatherDateInformation, getLocalStorage, goalWeightEnabledLocalStorageKey,
    localStorageKeys, setLocalStorage, trendlineEnabledLocalStorageKey,
    weightPredictionEnabledLocalStorageKey
} from './WeightTrackingGraphContextAlgorithms';
import { Props, WeightTrackingGraphContext } from './WeightTrackingGraphContextInterfaces';

const WeightTrackingGraphContextProvider = createContext<WeightTrackingGraphContext>(createDefaultState("Metric"));

export const WeightTrackingGraphContextComponent: React.FC<Props> = ({ children}) => {
    const { measurementSystem } = useProfileContext();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [state, setState] = useState<WeightTrackingGraphContext>(createDefaultState(measurementSystem));

    const setPartialState = (partialState: Partial<WeightTrackingGraphContext>) => {
        localStorageKeys.forEach((localStorageKey) => {
            if (localStorageKey in partialState) {
              setLocalStorage(localStorageKey, partialState[localStorageKey] as boolean);
            }
        });
        
        setState((prevState) => ({ ...prevState, ...partialState }));
    };

    useEffect(() => {
        setIsLoading(true);
      
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
      
          setPartialState({
            trendlineEnabled: getLocalStorage(trendlineEnabledLocalStorageKey),
            goalWeightEnabled: getLocalStorage(goalWeightEnabledLocalStorageKey),
            enableWeightPrediction: getLocalStorage(weightPredictionEnabledLocalStorageKey),
          });
      
          setIsLoading(false);
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
