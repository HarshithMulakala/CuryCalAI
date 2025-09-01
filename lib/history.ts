import { Meal } from '../types';

let meals: Meal[] = [];

export function addMeal(meal: Meal) {
  meals = [meal, ...meals];
}

export function getMeals(): Meal[] {
  return meals;
}

export function getMeal(id: string): Meal | undefined {
  return meals.find(m => m.id === id);
}

export function clearMeals() {
  meals = [];
}