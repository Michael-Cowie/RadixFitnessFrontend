export type DateToWeight = Record<string, string>

export type DateToUserData = {
    [date: string]: {
      weight_kg: number;
      notes: string;
    };
  };
  