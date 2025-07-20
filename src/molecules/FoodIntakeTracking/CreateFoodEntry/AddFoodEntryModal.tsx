import InfoTextField from 'atoms/InfoTextField';
import NumberedTextFieldUnitAndInformation from 'atoms/inputs/NumberedTextFieldWithRange/NumberedTextFieldWithRange';
import { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import { AddFoodEntryMode, AddFoodEntryProps, RowData } from './FoodEntryInterfaces';
import { useCommonFoods } from './CommonFoods';
import { searchForNutritionalContent } from 'services/FoodDataCentral/foodDataCentralService';
import { CircularProgress } from '@mui/material';

const caloriesinformationText = `
Calories are calculated automatically from the macronutrients.

Protein = 4 Calories per gram
Fats = 9 Calories per gram
Carbs = 4 Calories per gram

This is then multiplied by the number of servings.
`;

const macroNutrientInformationText = `
  Per 100g serving size.
`;

const AddFoodEntryModal: React.FC<AddFoodEntryProps> = ({ closeModalWindow, mode }) => {
  const isReadOnly = mode === AddFoodEntryMode.Search;
  const isSearch = mode === AddFoodEntryMode.Search;
  const macronutrientInformationText = isSearch ? macroNutrientInformationText : '';

  const { isLoading, createFoodEntry } = useFoodIntakeTrackingContext();
  const foodOptions = useCommonFoods();

  const [queryingAPI, setQueryingAPI] = useState<boolean>(false);

  // <SubmitButtonWithProgress buttonText="" displayLoadingAnimation={true} />

  const [foodName, setFoodName] = useState<string>('');
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalProtein, setTotalProtien] = useState<number>(0);
  const [totalFats, setTotalFats] = useState<number>(0);
  const [totalCarbs, setTotalCarbs] = useState<number>(0);
  const [servingSize, setServingSize] = useState<number>(1);

  const rows: RowData[] = [
    {
      min: 0,
      max: 1000,
      step: 0.1,
      value: totalProtein,
      label: 'Protein',
      setterCallback: setTotalProtien,
      units: 'g',
    },
    {
      min: 0,
      max: 1000,
      step: 0.1,
      value: totalFats,
      label: 'Fats',
      setterCallback: setTotalFats,
      units: 'g',
    },
    {
      min: 0,
      max: 1000,
      step: 0.1,
      value: totalCarbs,
      label: 'Carbs',
      setterCallback: setTotalCarbs,
      units: 'g',
    },
    {
      min: 1,
      max: 50,
      step: 0.1,
      value: servingSize,
      label: 'Serving',
      setterCallback: setServingSize,
    },
  ];

  useEffect(() => {
    setTotalCalories((totalProtein * 4 + totalFats * 9 + totalCarbs * 4) * servingSize);
  }, [totalProtein, totalFats, totalCarbs, servingSize]);

  useEffect(() => {
    if (isSearch && foodName) {
      setQueryingAPI(true);

      searchForNutritionalContent(foodName)
        .then((res) => {
          setTotalProtien(res.proteinPer100g);
          setTotalCarbs(res.carbsPer100g);
          setTotalFats(res.fatPer100g);
        })
        .catch((err) => {
          console.error('Error fetching nutrition:', err);
        })
        .finally(() => {
          setQueryingAPI(false);
        });
    }
  }, [foodName, isSearch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await createFoodEntry({
      foodName,
      totalCalories: totalCalories,
      totalProtein: totalProtein * servingSize,
      totalFats: totalFats * servingSize,
      totalCarbs: totalCarbs * servingSize,
      foodWeight: 0,
    });

    if (success) {
      closeModalWindow();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <GroupContainer>
        <Group title="Add Food Entry">
          {mode === AddFoodEntryMode.Search ? (
            <Autocomplete
              options={foodOptions}
              getOptionLabel={(option) => option.label}
              onChange={(_, value) => setFoodName(value?.label ?? '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Food"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {queryingAPI && <CircularProgress size={20} sx={{ marginRight: 2 }} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          ) : (
            <TextField
              required
              fullWidth
              label="Name"
              onChange={(e) => setFoodName(e.target.value)}
            />
          )}
        </Group>

        <Group title="Nutrition">
          <div className="flex justify-center">
            <InfoTextField
              label="Calories"
              inputText={totalCalories.toFixed(2)}
              informationText={caloriesinformationText}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between">
            {rows.slice(0, 2).map((row_data, index) => (
              <div className="m-1 w-56" key={index}>
                <NumberedTextFieldUnitAndInformation
                  min={row_data.min}
                  max={row_data.max}
                  step={row_data.step}
                  value={row_data.value}
                  label={row_data.label}
                  setterCallback={row_data.setterCallback}
                  units={row_data.units}
                  disabled={isReadOnly}
                  informationText={macronutrientInformationText}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row">
            <div className="m-1 w-56">
              <NumberedTextFieldUnitAndInformation
                min={rows[2].min}
                max={rows[2].max}
                step={rows[2].step}
                value={rows[2].value}
                label={rows[2].label}
                setterCallback={rows[2].setterCallback}
                units={rows[2].units}
                disabled={isReadOnly}
                informationText={macronutrientInformationText}
              />
            </div>

            {/* Serving Size - always editable */}
            <div className="m-1 w-56">
              <NumberedTextFieldUnitAndInformation
                min={rows[3].min}
                max={rows[3].max}
                step={rows[3].step}
                value={rows[3].value}
                label={rows[3].label}
                setterCallback={rows[3].setterCallback}
                units={rows[3].units}
                informationText={
                  isSearch ? 'Serving size are based on 100g from USDA FoodData Central' : ''
                }
              />
            </div>
          </div>
        </Group>
        <SubmitButton displayLoadingAnimation={isLoading} />
      </GroupContainer>
    </form>
  );
};

export default AddFoodEntryModal;
