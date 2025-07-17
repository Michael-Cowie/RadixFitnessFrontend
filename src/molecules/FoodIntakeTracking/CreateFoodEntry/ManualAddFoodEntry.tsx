import InfoTextField from 'atoms/InfoTextField';
import NumberedTextFieldWithRange, {
    AvailableUnits
} from 'atoms/inputs/NumberedTextFieldWithRange/NumberedTextFieldWithRange';
import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/FoodIntakeTrackingContext';
import { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField/TextField';

const informationText = `
Calories are calculated automatically from the macronutrients.

Protein = 4 Calories per gram
Fats = 9 Calories per gram
Carbs = 4 Calories per gram

This is then multiplied by the serving size.
`

interface RowData {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    label: string;
    setterCallback: (newValue: number) => void;
    units?: AvailableUnits;
}

interface ManualAddFoodEntryProps {
    closeModalWindow: () => void,
}

const ManualAddFoodEntry: React.FC<ManualAddFoodEntryProps> = ({  closeModalWindow }) => {
    const { isLoading, createFoodEntry } = useFoodIntakeTrackingContext()

    const [foodName, setFoodName] = useState<string>('');
    const [totalCalories, setTotalCalories] = useState<number>(0);
    const [totalProtein, setTotalProtien] = useState<number>(0);
    const [totalFats, setTotalFats] = useState<number>(0);
    const [totalCarbs, setTotalCarbs] = useState<number>(0);
    const [servingSize, setServingSize] = useState<number>(1);

    const rows: RowData[] = [
        {min: 0, max: 1000, step: 1, defaultValue: 0, label: 'Protein', setterCallback: setTotalProtien, units: 'g'},
        {min: 0, max: 1000, step: 1, defaultValue: 0, label: 'Fats', setterCallback: setTotalFats, units: 'g'},
        {min: 0, max: 1000, step: 1, defaultValue: 0, label: 'Carbs', setterCallback: setTotalCarbs, units: 'g'},
        {min: 1, max: 50, step: 1, defaultValue: 1, label: 'Serving size', setterCallback: setServingSize},
    ]

    useEffect(() => {
        setTotalCalories((totalProtein * 4 + totalFats * 9 + totalCarbs * 4) * servingSize);
    }, [totalProtein, totalFats, totalCarbs, servingSize])

    const handleSubmit = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        const success = await createFoodEntry({
            foodName,
            totalCalories: totalCalories,
            totalProtein: totalProtein * servingSize,
            totalFats: totalFats * servingSize,
            totalCarbs: totalCarbs * servingSize,
            foodWeight: 0,
        })

        if (success) {
            closeModalWindow();
        }
    }

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='m-2'>
                <TextField required label="Name" className="w-56" onChange={ (e) => setFoodName(e.target.value) }/>
            </div>

            <div className='m-2'>
                <InfoTextField label='Calories' inputText= { totalCalories } informationText={ informationText }/>
            </div>

            <div className='flex flex-col sm:flex-row sm:justify-between'>
                {rows.slice(0, 2).map((row_data, index) => (
                    <div className='m-1 w-56' key={index}>
                        <NumberedTextFieldWithRange
                            min={row_data.min}
                            max={row_data.max}
                            step={row_data.step}
                            defaultValue={row_data.defaultValue}
                            label={row_data.label}
                            setterCallback={row_data.setterCallback}
                            units={row_data.units}
                        />
                    </div>
                ))}
            </div>

            <div className='flex flex-col sm:flex-row'>
                {rows.slice(2,4).map((row_data, index) => (
                    <div className='m-1 w-56' key={index + 2}>
                        <NumberedTextFieldWithRange
                            min={row_data.min}
                            max={row_data.max}
                            step={row_data.step}
                            defaultValue={row_data.defaultValue}
                            label={row_data.label}
                            setterCallback={row_data.setterCallback}
                            units={row_data.units}
                        />
                    </div>
                ))}
            </div>

            <div className='w-full mt-4 flex justify-center items-center'>
                <div className='w-40' onClick={ handleSubmit }>
                    <SubmitButtonWithProgress
                        buttonText='Submit'
                        displayLoadingAnimation={ isLoading }
                    />
                </div>
            </div>
        </div>
    )
}

export default ManualAddFoodEntry;
