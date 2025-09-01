import { useState, useCallback } from 'react';
import { Meal } from '../types';

export function useHistoryStore() {
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = useCallback((meal: Meal) => {
    setMeals(prev => [meal, ...prev]);
  }, []);

  const getMeal = useCallback((id: string) => meals.find(m => m.id === id), [meals]);

  const clear = useCallback(() => setMeals([]), []);

  return { meals, addMeal, getMeal, clear };
}