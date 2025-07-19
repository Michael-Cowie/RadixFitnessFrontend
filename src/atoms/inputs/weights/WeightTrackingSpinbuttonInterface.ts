export interface Props {
  value: number;
  onChange: (newValue: number) => void;
  displayUnit: string;
  name: string;
  label: string;
  disabled?: boolean;
}
