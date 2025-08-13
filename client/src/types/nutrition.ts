export interface Food {
  _id: string;
  name: string;
  brand?: string;
  barcode?: string;
  category: 'fruits' | 'vegetables' | 'grains' | 'protein' | 'dairy' | 'fats' | 'beverages' | 'snacks' | 'desserts' | 'condiments' | 'other';
  servingSize: {
    amount: number;
    unit: 'g' | 'ml' | 'oz' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'slice';
  };
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    saturatedFat: number;
    transFat: number;
  };
  vitamins?: {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB1?: number;
    vitaminB2?: number;
    vitaminB3?: number;
    vitaminB6?: number;
    vitaminB12?: number;
    folate?: number;
  };
  minerals?: {
    calcium?: number;
    iron?: number;
    magnesium?: number;
    phosphorus?: number;
    potassium?: number;
    zinc?: number;
  };
  dietaryTags?: string[];
  imageUrl?: string;
  isPublic: boolean;
  createdBy?: string;
  usageCount: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealEntry {
  food: Food;
  servingAmount: number;
  servingUnit: 'g' | 'ml' | 'oz' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'slice';
  multiplier: number;
  notes?: string;
}

export interface Meal {
  _id: string;
  user: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name?: string;
  entries: MealEntry[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    saturatedFat: number;
    transFat: number;
  };
  imageUrl?: string;
  notes?: string;
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NutritionGoal {
  _id: string;
  user: string;
  dailyTargets: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    water: number;
  };
  macroRatios: {
    proteinPercentage: number;
    carbPercentage: number;
    fatPercentage: number;
  };
  weightGoal: 'lose' | 'maintain' | 'gain';
  targetWeight?: number;
  weeklyWeightChange: number;
  dietaryPreferences?: string[];
  mealTiming: {
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    snackTimes?: string[];
  };
  reminders: {
    mealReminders: boolean;
    waterReminders: boolean;
    weightReminders: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  water: number;
}

export interface WeeklyData {
  date: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface NutritionDashboard {
  dailyTotals: DailyTotals;
  nutritionGoal: NutritionGoal;
  recentMeals: Meal[];
  weeklyData: WeeklyData[];
  todaysMeals: Meal[];
}

export interface FoodSearchParams {
  q?: string;
  category?: string;
  limit?: number;
}

export interface MealLogParams {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  entries: (Omit<MealEntry, 'food'> & { food: string })[];
  name?: string;
  date?: string;
  notes?: string;
  tags?: string[];
}

export interface NutritionGoalUpdate {
  dailyTargets?: Partial<NutritionGoal['dailyTargets']>;
  macroRatios?: Partial<NutritionGoal['macroRatios']>;
  weightGoal?: NutritionGoal['weightGoal'];
  targetWeight?: number;
  weeklyWeightChange?: number;
  dietaryPreferences?: string[];
  mealTiming?: Partial<NutritionGoal['mealTiming']>;
  reminders?: Partial<NutritionGoal['reminders']>;
  isActive?: boolean;
}
