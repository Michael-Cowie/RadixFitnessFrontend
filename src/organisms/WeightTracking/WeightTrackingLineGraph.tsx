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

/*
 * To replace only the “Goal Weight” legend swatch (the small legend icon), we set that legend item’s
 * fillStyle and strokeStyle to transparent. This targets the built-in rectangle legend that would
 * otherwise be drawn. We do this in the beforeDraw method which runs after layout and before painting to suppress the
 * default swatch.
 *
 * Finally in afterDraw which runs after the frame is painted we render a green circle
 * at the swatch’s hit-box center, leaving all chart points and other legend items unchanged.
 *
 * The builtin behaviour of usePointStyle was not possible as it forcibly affected other Legends
 * and we only wanted to change the Goal Weight in isolation as it represented a single point.
 */
const GoalWeightLegendCircle = {
  id: 'goalWeightLegendCircle',

  //@ts-expect-error Third party TypeScript errors
  beforeDraw(chart) {
    const legend = chart.legend;
    if (!legend || !legend.legendItems) return;

    //@ts-expect-error Third party TypeScript errors
    legend.legendItems.forEach((item) => {
      if (item.text === 'Goal Weight') {
        item.fillStyle = 'rgba(0,0,0,0)'; /* Set the inside of the shape to invisible */
        item.strokeStyle = 'rgba(0,0,0,0)'; /* Set the border (stroke) to invisible */
      }
    });
  },

  //@ts-expect-error Third party TypeScript errors
  afterDraw(chart) {
    const legend = chart.legend;
    if (!legend || !legend.legendItems || !legend.legendHitBoxes) return;

    const ctx = chart.ctx;

    //@ts-expect-error Third party TypeScript errors
    legend.legendItems.forEach((item, i: number) => {
      if (item.text !== 'Goal Weight') return;

      /*
       * Chart.js stores an axis-aligned rectangle as origin + size, not two corners.

       * - (0, 0) is the top-left of the canvas, not the legend where
       * `left` - The x of the rectangles top left corner.
       * `top` - The y of the rectangles top left corner (Canvas Y grows downwards).
       * `width` - Rectangle widths in pixels.
       * `height` - Rectangle height in pixels.
       */
      const hitBox = legend.legendHitBoxes[i];
      if (!hitBox) return;

      const fontSize = 8;
      const width = 40;
      const centerX = hitBox.left + width / 2;
      const centerY = hitBox.top + hitBox.height / 2;
      const radius = fontSize / 2;
      const endAngle = 0;
      const counterclockwise = Math.PI * 2; /* Complete circle. Degrees are in radians */

      ctx.save(); /* Snapshot the current drawing state so changes won't leak to future renders */

      ctx.fillStyle = '#6dc162'; /* Same colour as the green dot for the Goal Weight */

      ctx.beginPath(); /* Start a fresh path so this circle isn't joined to any prior path */

      /*
       * The `arc` function builds the geometry, it does not paint it.
       *
       * An arc of a circle is a portion of the circumfrance.
       *
       * The previous original Legend is now invisible. Using `arc` we now create the path for a full circle
       * that represents the Legend and will be painted using later code.
       */
      ctx.arc(centerX, centerY, radius, endAngle, counterclockwise);

      /* `arc` builds the geometry. Now, we fill this arc with the fillStyle previously defined */
      ctx.fill();

      /* Revert to the previous `save` drawing state. This will being back the previous fillStyle state.*/
      ctx.restore();
    });
  },
};
Chart.register(GoalWeightLegendCircle);

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
      spanGaps: true,
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
        title: { display: false },
        ticks: { maxRotation: 45, minRotation: 0 },
      },
      y: {
        title: { display: false },
        ticks: {
          callback: (value: number | string) => `${value} ${displayUnit}`,
          padding: 8,
        },
      },
    },
  };

  return (
    <Line
      // @ts-expect-error Third party TypeScript types
      options={options}
      data={data}
    />
  );
};

export default WeightTrackingLineGraph;
