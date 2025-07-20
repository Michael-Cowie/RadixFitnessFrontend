import { useContext } from 'react';
import { WeightTrackingGraphContextProvider } from './WeightTrackingGraphContext'; // must be exported

const useWeightTrackingGraphContext = () => {
  return useContext(WeightTrackingGraphContextProvider);
};

export default useWeightTrackingGraphContext;
