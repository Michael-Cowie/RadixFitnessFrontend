import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
import {
    convertToUnit, findFurtherestDate, MM_DD_formatteDate, YYYY_MM_DD_formattedDate
} from 'lib/utils';
import { Line } from 'react-chartjs-2';
import { DateToWeight } from 'routes/WeightTrackingPage';
import styled from 'styled-components';

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

interface Props {
    displayUnit: string,
    dateRange: number,
    initialData: DateToWeight,
    trendLineEnabled: boolean
}

interface ToolTip {
  label: string,
  raw: string
}

function plottingData(initialData: DateToWeight, dateRange: number, unit: string): [string[], (string | null)[]] {
  const minimum_future_days = 2;
  const minimum_number_days = 7;

  let data: (string | null)[] = [];
  let labels: string[] = [];
   
  if (dateRange === Infinity) {
    const datesWithWeight: string[] = Object.keys(initialData);
    if (datesWithWeight.length == 0) {
      for (let dateOffset = -minimum_number_days; dateOffset <= minimum_future_days; dateOffset++){
        data.push(null);
        labels.push(MM_DD_formatteDate(dateOffset))
      }
    } else {
      let furtherestDate = findFurtherestDate(datesWithWeight);
      let currentOffset = 0;
      let formattedDate = YYYY_MM_DD_formattedDate(currentOffset);

      /**
       * Initial check if we have a weight for today.
       */
      if (formattedDate in initialData) {
        data.unshift(convertToUnit(unit, initialData[formattedDate]));
      } else {
        data.unshift(null);
      }
      labels.push(MM_DD_formatteDate(currentOffset))

      /**
       * Continually iterate from Today until the furtherest date.
       */
      while (formattedDate !== furtherestDate) {
        currentOffset -= 1;
        formattedDate = YYYY_MM_DD_formattedDate(currentOffset);
        if (formattedDate in initialData) {
          data.unshift(convertToUnit(unit, initialData[formattedDate]));
        } else {
          data.unshift(null);
        }
        labels.unshift(MM_DD_formatteDate(currentOffset));
      }
    }
  } else {
    for (let dateOffset = -dateRange; dateOffset <= minimum_future_days; dateOffset++){
      const dateLabel = YYYY_MM_DD_formattedDate(dateOffset);
      if (dateLabel in initialData) {
        data.push(convertToUnit(unit, initialData[dateLabel]));
      } else {
        data.push(null);
      }
      labels.push(MM_DD_formatteDate(dateOffset))
    }
  }
  return [labels, data];
}

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

const WeightTrackingLineGraph: React.FC<Props> = ({ displayUnit, dateRange, initialData, trendLineEnabled }) => {

  function determine_tooltip(tooltipItem: ToolTip) {
      const label = tooltipItem.label;
      const weight_kg = tooltipItem.raw;

      return `On ${label}, you weighed ${weight_kg}${displayUnit}!`;
  }
  // @ts-ignore
  options.plugins.tooltip.callbacks.label = determine_tooltip

  const [labels, graphData] = plottingData(initialData, dateRange, displayUnit);

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
    <LineContainer>
        <Line 
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