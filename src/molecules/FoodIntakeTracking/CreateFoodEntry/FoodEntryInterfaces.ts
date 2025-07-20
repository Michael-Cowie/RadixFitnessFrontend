import { AvailableUnits } from "atoms/inputs/NumberedTextFieldWithRange/NumberedTextFieldWithRange";

export interface RowData {
  min: number;
  max: number;
  step: number;
  value: number;
  label: string;
  setterCallback: (newValue: number) => void;
  units?: AvailableUnits;
}

export enum AddFoodEntryMode {
  Search = 'search',
  Manual = 'manual',
}

export interface AddFoodEntryProps {
  closeModalWindow: () => void;
  mode: AddFoodEntryMode;
}
