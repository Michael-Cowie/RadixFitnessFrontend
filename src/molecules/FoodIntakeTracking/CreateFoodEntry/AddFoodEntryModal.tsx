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

import * as Sentry from '@sentry/react';

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

  const caloriesField = (
    <div className="flex mb-2 sm:justify-center">
      <InfoTextField
        label="Calories"
        inputText={totalCalories.toFixed(2)}
        informationText={caloriesinformationText}
      />
    </div>
  );

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
                      .catch((error) => Sentry.captureException(error))
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
            {/* Desktop layout */}
            <div className="hidden sm:block">
              {caloriesField}

              <div className="flex flex-row justify-between space-y-0 mt-3">
                {rows.slice(0, 2).map((row, index) => (
                  <div className="w-56" key={index}>
                    <NumberedTextFieldUnitAndInformation {...row} />
                  </div>
                ))}
              </div>

              <div className="flex flex-row justify-between space-y-0 mt-3">
                {rows.slice(2).map((row, index) => (
                  <div className="w-56" key={index}>
                    <NumberedTextFieldUnitAndInformation
                      {...row}
                      informationText={
                        index === 1
                          ? 'Serving size are based on 100g from USDA FoodData Central'
                          : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile layout  - Group to a single column to prevent the Group component causing spaces between child */}
            <div className="block sm:hidden">
              {caloriesField}
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-2">
                {rows.map((row, index) => (
                  <div className="w-full" key={index}>
                    <NumberedTextFieldUnitAndInformation
                      {...row}
                      informationText={
                        index === 3
                          ? 'Serving size are based on 100g from USDA FoodData Central'
                          : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </Group>
        </SensitivityController>
        <SensitivityController sensitive={!queryingAPI}>
          <SubmitButton displayLoadingAnimation={isLoading} />
        </SensitivityController>
      </GroupContainer>
    </ModalForm>
  );
};

export default AddFoodEntryModal;
