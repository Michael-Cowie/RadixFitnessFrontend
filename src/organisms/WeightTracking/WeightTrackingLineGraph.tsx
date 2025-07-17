import {
    CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import { Line } from 'react-chartjs-2';

import {
    calculateGoalWeightData, calculatePredictedData, calculateUserData, convertDataToDisplayUnit,
    determine_tooltip, formatLabels, generateDateRange, generateLabelsFromDates
} from './WeightTrackingAlgorithms';

Chart.register(
  chartTrendline,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  type: 'line',
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  plugins: {
    title: {
      display: false,
      text: 'Current progress!',
    },
    legend: {
      display: true,
      onClick: () => null,
    },
    tooltip: {
      callbacks: {
        title: () => null
      },
      displayColors: false
    }
  }
};

const WeightTrackingLineGraph = () => {
  const { trendlineEnabled, displayUnit, goalWeightEnabled, enableWeightPrediction, dateToNotes } = useWeightTrackingGraphContext();

  const dateRange = generateDateRange();
  const labels = generateLabelsFromDates(dateRange);

  const userData = calculateUserData(labels);
  const predictedData = calculatePredictedData(labels, userData);
  const goalWeightData = calculateGoalWeightData(dateRange);

  const convertedUserData = convertDataToDisplayUnit(userData);
  const convertedPredictedData = convertDataToDisplayUnit(predictedData);
  const convertedGoalWeightData = convertDataToDisplayUnit(goalWeightData);


  // @ts-ignore
  options.plugins.tooltip.callbacks.label = determine_tooltip(labels, dateToNotes, displayUnit);

  window.addEventListener('resize', function () {
    for (let chart of Object.values(Chart.instances)) {
      chart.resize();
    }
  })

  /**
   * We need to reset this to null to remove it, if it has been previously displayed. 
   * Conditionally adding it such as ,
   * 
   * ...(createTrendLine && {
   *      trendlineLinear: {
   *        ...
   * }})
   * 
   * will not remove it from the canvas after it had been rendered.
   */
  let trendLineData = null;
  if (trendlineEnabled && userData.filter(v => v != null).length > 1) {
    trendLineData = {
        colorMin: "orange",
        colorMax: "orange",
        lineStyle: "dotted",
        width: 3
    }
  }

  let datasets = [
    {
      label: `Weight in ${ displayUnit }`,
      data: convertedUserData,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      spanGaps: true, // Connect the line for null points
      trendlineLinear: trendLineData
    }
  ]

  const displayPredictedDataset = predictedData.length > 1 && goalWeightEnabled && enableWeightPrediction;
  if (displayPredictedDataset) {
    //@ts-ignore
    datasets.push({
      label: "Goal Prediction",
      data: convertedPredictedData,
      borderColor: '#55b646',
      backgroundColor: '#3f9532',
    });
  }
  
  if (goalWeightEnabled) {
    //@ts-ignore
    datasets.push({
      label: "Goal Weight",
      data: convertedGoalWeightData,
      borderColor: '#6dc162',
      backgroundColor: '#6dc162',
    });
  }


  const data = {
      labels: formatLabels(labels),
      datasets
  };

  return (
    <Line
      //@ts-ignore
      options={ options } 
      //@ts-ignore
      data={ data }
    />
  )
}
export default WeightTrackingLineGraph;
