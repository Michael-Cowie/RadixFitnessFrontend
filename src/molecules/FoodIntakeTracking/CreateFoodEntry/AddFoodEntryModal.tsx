import InfoTextField from 'atoms/InfoTextField';
import NumberedTextFieldUnitAndInformation from 'atoms/inputs/NumberedTextFieldWithRange/NumberedTextFieldWithRange';
import { useEffect, useRef, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import { Group, GroupContainer, SubmitButton } from 'atoms/design_patterns/Group';
import { AddFoodEntryProps, RowData } from './FoodEntryInterfaces';
import { searchForNutritionalContent } from 'services/FoodDataCentral/foodDataCentralService';
import { CircularProgress } from '@mui/material';
import ModalForm from 'atoms/design_patterns/ModalForm';
import SensitivityController from 'atoms/design_patterns/SensitivityWrapper';
import { FoodNutrientSummary } from 'services/FoodDataCentral/foodDataCentralInterface';

const caloriesinformationText = `
Calories are calculated automatically from the macronutrients.

Protein = 4 Calories per gram
Fats = 9 Calories per gram
Carbs = 4 Calories per gram

This is then multiplied by the number of servings.
`;

const debounce_delay_ms = 300;

const AddFoodEntryModal: React.FC<AddFoodEntryProps> = ({ closeModalWindow }) => {
  const { isLoading, createFoodEntry } = useFoodIntakeTrackingContext();

  const [foodOptions, setFoodOptions] = useState<FoodNutrientSummary[]>([]);

  const [queryingAPI, setQueryingAPI] = useState<boolean>(false);

  const [foodName, setFoodName] = useState<string>('');
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalProtein, setTotalProtien] = useState<number>(0);
  const [totalFats, setTotalFats] = useState<number>(0);
  const [totalCarbs, setTotalCarbs] = useState<number>(0);
  const [servingSize, setServingSize] = useState<number>(1);

  const NO_MATCH_OPTION: FoodNutrientSummary = {
    description: `No matches. Continue with: ${foodName}`,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
  };
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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
      min: 0.1,
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

  const handleSubmit = () => {
    createFoodEntry({
      foodName,
      totalCalories: totalCalories,
      totalProtein: totalProtein * servingSize,
      totalFats: totalFats * servingSize,
      totalCarbs: totalCarbs * servingSize,
      foodWeight: 0,
    }).then(() => {
      closeModalWindow();
    });
  };

  return (
    <ModalForm onSubmit={handleSubmit} closeModalWindow={closeModalWindow}>
      <GroupContainer>
        <Group title="Add Food Entry">
          <Autocomplete
            freeSolo
            options={
              foodOptions.length > 0
                ? foodOptions
                : foodName === '' || queryingAPI
                  ? []
                  : [NO_MATCH_OPTION]
            }
            getOptionLabel={(option) => {
              return (option as FoodNutrientSummary).description;
            }}
            isOptionEqualToValue={(a, b) => a.description === b.description}
            inputValue={foodName}
            filterOptions={(x) => x} // Disable MUI attempts at filtering from user input.
            onInputChange={(_, userInput, reason) => {
              if (reason === 'input') {
                setFoodName(userInput);
                setQueryingAPI(false);
                setFoodOptions([]);

                if (debounceTimeout.current) {
                  clearTimeout(debounceTimeout.current);
                }

                if (userInput !== '') {
                  setQueryingAPI(true);

                  debounceTimeout.current = setTimeout(() => {
                    searchForNutritionalContent(userInput)
                      .then((results) => setFoodOptions(results))
                      .catch(() => setFoodOptions([]))
                      .finally(() => setQueryingAPI(false));
                  }, debounce_delay_ms);
                }
              }
            }}
            onChange={(_, selectedOption) => {
              const nutrient = selectedOption as FoodNutrientSummary;
              if (nutrient.description === NO_MATCH_OPTION.description) {
                setFoodName(foodName);
              } else {
                setFoodName(nutrient.description);
              }

              setTotalProtien(nutrient.proteinPer100g);
              setTotalCarbs(nutrient.carbsPer100g);
              setTotalFats(nutrient.fatPer100g);
            }}
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
        </Group>

        <SensitivityController sensitive={!queryingAPI}>
          <Group title="Nutrition">
            <div className="flex m-1 sm:m-0 sm:justify-center">
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
                  informationText={'Serving size are based on 100g from USDA FoodData Central'}
                />
              </div>
            </div>
          </Group>
          <SubmitButton displayLoadingAnimation={isLoading} />
        </SensitivityController>
      </GroupContainer>
    </ModalForm>
  );
};

export default AddFoodEntryModal;
