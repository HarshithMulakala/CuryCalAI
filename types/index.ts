export type Macro = {
  carbs: number; // grams
  protein: number; // grams
  fat: number; // grams
};

export type FoodItem = {
  id: string;
  name: string;
  quantity?: string; // e.g., "1 roti", "200g"
  calories: number;
  macros: Macro;
  photo?: string; // local uri or remote URL
};

export type Meal = {
  id: string;
  name?: string;
  items: FoodItem[];
  totalCalories: number;
  totalMacros: Macro;
  photo?: string;
  timestamp: number;
  note?: string;
};