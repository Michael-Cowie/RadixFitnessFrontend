import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import { determine_tooltip, plottingData } from './WeightTrackingAlgorithms';
import { Props } from './WeightTrackingInterfaces';

ChartJS.register(
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
  plugins: {
    title: {
      display: false,
      text: 'Current progress!',
    },
    legend: {
      display: false,
      onClick: () => null,
    },
    tooltip: {
      callbacks: {
        title: () => null
      },
      displayColors: false
    }

  },
};

const WeightTrackingLineGraph: React.FC<Props> = ({ displayUnit, dateRange, dateToWeight, trendLineEnabled }) => {

  // @ts-ignore
  options.plugins.tooltip.callbacks.label = determine_tooltip(displayUnit);

  const [labels, graphData] = plottingData(dateToWeight, dateRange, displayUnit);

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
  if (trendLineEnabled && graphData.some((value) => value !== null)) {
    trendLineData = {
        colorMin: "green",
        colorMax: "green",
        lineStyle: "dotted",
        width: 3
    }
  }

  const data = {
      labels,
      datasets: [
          {
            label: "Weight Tracking",
            data: graphData,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            spanGaps: true, // Connect the line for null points
            trendlineLinear: trendLineData
          }
      ]
  };

  return (
    <LineContainer className="mb-10">
        <Line
          // @ts-ignore
          options={options} 
          data={data}
        />
    </LineContainer>
  )
}
export default WeightTrackingLineGraph;

const LineContainer = styled.div`
  width: 50%;
  height: 50%;
`