import { useContext } from 'react';
import { FoodIntakeTrackingContext } from './FoodIntakeTrackingContext';

const useFoodIntakeTrackingContext = () => {
  return useContext(FoodIntakeTrackingContext);
};

export default useFoodIntakeTrackingContext;
