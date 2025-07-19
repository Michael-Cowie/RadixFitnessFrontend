import SelectableButton from 'atoms/SelectableButton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';

export function createDisplayText(range: number): string {
    if (range === Infinity) return "All Entries";
    return `${range} days`;
}

const dataSelectionRange = [7, 14, 30, 90, Infinity];

const WeightTrackingDateRangeSelection = () => {
    const {
        ui: { dateRange },
        data: { datesWithWeight },
        setPartialState,
    } = useWeightTrackingGraphContext();

    return (
        <>
            <div className="mt-3 w-full flex justify-center font-bold">
                <h1>Select a range</h1>
            </div>

            <div className="flex flex-col md:flex-row">
                <div className="mt-2 w-full flex flex-row justify-center items-center">
                    {dataSelectionRange.slice(0, 3).map((range, i) => (
                        <SelectableButton
                            key={i}
                            selected={range === dateRange}
                            displayText={createDisplayText(range)}
                            onClick={() => setPartialState({ ui: { dateRange: range } })}
                        />
                    ))}
                </div>

                <div className="mt-2 w-full flex flex-row justify-center items-center">
                    {dataSelectionRange.slice(3).map((range, i) => (
                        <SelectableButton
                            key={i}
                            selected={range === dateRange}
                            displayText={createDisplayText(range)}
                            onClick={() => setPartialState({ ui: { dateRange: range } })}
                            isDisabled={range === Infinity && datesWithWeight.length === 0}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default WeightTrackingDateRangeSelection;
