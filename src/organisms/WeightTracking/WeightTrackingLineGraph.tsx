import {
    CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
import { Line } from 'react-chartjs-2';

import {
    calculateGoalWeightData, calculatePredictedData, calculateUserData, convertDataToDisplayUnit,
    determine_tooltip, formatLabels, generateLabelRange
} from './WeightTrackingAlgorithms';
import { Props } from './WeightTrackingInterfaces';

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

const WeightTrackingLineGraph: React.FC<Props> = ({ displayUnit, dateRange, dateToUserData, trendLineEnabled, goalInformation }) => {
  const labels = generateLabelRange(dateToUserData, dateRange, goalInformation);

  const userData = calculateUserData(labels, dateToUserData);
  const predictedData = calculatePredictedData(labels, userData, dateToUserData, goalInformation);
  const goalWeightData = calculateGoalWeightData(labels, goalInformation);

  const convertedUserData = convertDataToDisplayUnit(userData, displayUnit);
  const convertedPredictedData = convertDataToDisplayUnit(predictedData, displayUnit);
  const convertedGoalWeightData = convertDataToDisplayUnit(goalWeightData, displayUnit);


  // @ts-ignore
  options.plugins.tooltip.callbacks.label = determine_tooltip(labels, dateToUserData, displayUnit);

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
  if (trendLineEnabled && userData.some((v) => v !== null)) {
    trendLineData = {
        colorMin: "green",
        colorMax: "green",
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
    },
    predictedData.length > 0 && {
      label: "Goal Prediction",
      data: convertedPredictedData,
      borderColor: '#55b646',
      backgroundColor: '#3f9532',
    },
    goalInformation.enablePrediction && {
        label: "Goal Weight",
        data: convertedGoalWeightData,
        borderColor: '#55b646',
        backgroundColor: '#3f9532',
      }
  ]

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
