import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
import { Line } from 'react-chartjs-2';

import {
  calculateGoalWeightData,
  calculatePredictedData,
  calculateUserData,
  convertDataToDisplayUnit,
  determine_tooltip,
  formatLabels,
  generateDateRangeAxisData,
  generateLabelsFromDates,
} from './WeightTrackingAlgorithms';
import { measurementSystemToUnit } from 'lib/weightTranslations';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/hooks';
import useProfileContext from 'context/ProfileContext/hooks';

Chart.register(
  chartTrendline,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const WeightTrackingLineGraph = () => {
  const {
    ui: { trendlineEnabled, goalWeightEnabled, enableWeightPrediction, dateRange },
    userData: { goalWeightKg, goalDate },
    data: { dateToWeightKg, datesWithWeight, dateToNotes },
  } = useWeightTrackingGraphContext();

  const { measurementSystem } = useProfileContext();
  const displayUnit = measurementSystemToUnit(measurementSystem);

  const dataRangeAxisData = generateDateRangeAxisData(
    dateRange,
    datesWithWeight,
    goalWeightEnabled,
    goalDate,
  );
  const labels = generateLabelsFromDates(dataRangeAxisData);

  const userData = calculateUserData(labels, dateToWeightKg);
  const predictedData = calculatePredictedData(
    labels,
    userData,
    enableWeightPrediction,
    goalDate,
    datesWithWeight,
    dateToWeightKg,
  );
  const goalWeightData = calculateGoalWeightData(
    dataRangeAxisData,
    goalWeightEnabled,
    goalWeightKg,
    goalDate,
  );

  const convertedUserData = convertDataToDisplayUnit(userData, measurementSystem);
  const convertedPredictedData = convertDataToDisplayUnit(predictedData, measurementSystem);
  const convertedGoalWeightData = convertDataToDisplayUnit(goalWeightData, measurementSystem);

  window.addEventListener('resize', function () {
    for (const chart of Object.values(Chart.instances)) {
      chart.resize();
    }
  });

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
  if (trendlineEnabled && userData.filter((v) => v != null).length > 1) {
    trendLineData = {
      colorMin: 'orange',
      colorMax: 'orange',
      lineStyle: 'dotted',
      width: 3,
    };
  }

  const datasets = [
    {
      label: `Weight in ${displayUnit}`,
      data: convertedUserData,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      spanGaps: true, // Connect the line for null points
      trendlineLinear: trendLineData,
    },
  ];

  const displayPredictedDataset =
    predictedData.length > 1 && goalWeightEnabled && enableWeightPrediction;
  if (displayPredictedDataset) {
    //@ts-expect-error Third party TypeScript errors
    datasets.push({
      label: 'Goal Prediction',
      data: convertedPredictedData,
      borderColor: '#55b646',
      backgroundColor: '#3f9532',
    });
  }

  if (goalWeightEnabled) {
    //@ts-expect-error Third party TypeScript errors
    datasets.push({
      label: 'Goal Weight',
      data: convertedGoalWeightData,
      borderColor: '#6dc162',
      backgroundColor: '#6dc162',
    });
  }

  const data = {
    labels: formatLabels(labels),
    datasets,
  };

  const options = {
    type: 'line',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: {
        display: true,
        onClick: () => null,
      },
      tooltip: {
        callbacks: {
          title: () => null,
          label: determine_tooltip(labels, dateToNotes, displayUnit),
        },
        displayColors: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Month',
          font: { size: 16, weight: 'bold' },
          padding: { top: 20 },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: { display: false }, // hide axis title
        ticks: {
          callback: (value: number | string) => `${value} ${displayUnit}`,
          padding: 8,
        },
      },
    },
  };

  return (
    <Line
      //@ts-expect-error Third party TypeScript errors
      options={options}
      data={data}
    />
  );
};
export default WeightTrackingLineGraph;
