export interface MacroNutrientRowProps {
    nutrientName: string,
    currentValue: number,
    maxValue: number,
    goalSetter: (value: number) => void

}

export interface Offset {
    offset: number,
}

export interface MacroNutrientProgress {
    currentCalories: number;
    goalCalories: number;
    currentProtein: number;
    goalProtein: number;
    currentCarbs: number;
    goalCarbs: number;
    currentFats: number;
    goalFats: number;
}