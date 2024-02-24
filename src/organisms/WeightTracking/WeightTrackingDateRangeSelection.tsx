import SelectableButton from 'atoms/SelectableButton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';

export function createDisplayText(range: number): string {
    if (range === Infinity) return "All";

    return `${range} days`;
}

const dataSelectionRange = [7, 14, 30, 90, Infinity];

const WeightTrackingDateRangeSelection = () => {
    const { setPartialState, dateRange: selectedDateRange} = useWeightTrackingGraphContext();

    return (
        <>
        <div className="mt-3 w-full flex justify-center font-bold">
            <h1> Select a range </h1>
        </div>

        <div className="flex flex-col md:flex-row">
            <div className="mt-2 w-full flex flex-row justify-center items-center">
                { dataSelectionRange.slice(0, 3).map((dateRange, i) => (
                    <SelectableButton 
                        selected={ dateRange === selectedDateRange } 
                        displayText={ createDisplayText(dateRange) }
                        onClick={ () => setPartialState({dateRange}) }
                        key={ i }
                    />
                )) }
            </div>

            <div className="mt-2 w-full flex flex-row justify-center items-center">
                { dataSelectionRange.slice(3, 6).map((dateRange, i) => (
                        <SelectableButton 
                            selected={ dateRange === selectedDateRange } 
                            displayText={ createDisplayText(dateRange) }
                            onClick={ () => setPartialState({dateRange}) }
                            key={ i }
                        />
                )) }
            </div>
        </div>
      </>
    )
};

export default WeightTrackingDateRangeSelection;
