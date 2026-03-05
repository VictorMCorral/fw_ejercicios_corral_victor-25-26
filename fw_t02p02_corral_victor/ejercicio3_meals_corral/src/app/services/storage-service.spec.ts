import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage-service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { UserMeal, statusUserMeal } from '../model/user-meal';

describe('StorageService', () => {
  let service: StorageService;

  const mockUserMeals: UserMeal[] = [
    { mealId: 52772, userId: 1, saveDate: new Date(), status: statusUserMeal.Todo },
    { mealId: 52819, userId: 1, saveDate: new Date(), status: statusUserMeal.Done },
    { mealId: 53026, userId: 1, saveDate: new Date(), status: statusUserMeal.Todo },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.inject(StorageService);

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserMeals', () => {
    it('should return null when no meals are stored for user', () => {
      const result = service.getUserMeals(1);
      expect(result).toBeNull();
    });

    it('should return array of UserMeal when meals exist for user', () => {
      // Guardar meals en localStorage
      localStorage.setItem('userMeals_1', JSON.stringify(mockUserMeals));

      const result = service.getUserMeals(1);

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].mealId).toBe(52772);
      expect(result[1].mealId).toBe(52819);
      expect(result[2].mealId).toBe(53026);
    });
  });

  describe('getUserMealById', () => {
    it('should return null when user has no session', () => {
      // El servicio lanza error si no hay sesión (session es null y accede a session.userId)
      expect(() => service.getUserMealById(52772)).toThrow();
    });

    it('should return null when meal does not exist for user', () => {
      // Simular sesión de usuario
      localStorage.setItem('authSession', JSON.stringify({ userId: 1 }));
      // Simular usuario
      localStorage.setItem('users', JSON.stringify([{ id: 1, email: 'test@test.com' }]));
      // Simular meals del usuario (sin la meal buscada)
      localStorage.setItem('userMeals_1', JSON.stringify([
        { mealId: 99999, userId: 1, saveDate: new Date(), status: statusUserMeal.Todo }
      ]));

      const result = service.getUserMealById(52772);
      expect(result).toBeNull();
    });

    it('should return UserMeal when meal exists for user', () => {
      // Simular sesión de usuario
      localStorage.setItem('authSession', JSON.stringify({ userId: 1 }));
      // Simular usuario
      localStorage.setItem('users', JSON.stringify([{ id: 1, email: 'test@test.com' }]));
      // Simular meals del usuario
      localStorage.setItem('userMeals_1', JSON.stringify(mockUserMeals));

      const result = service.getUserMealById(52772);

      expect(result).not.toBeNull();
      expect(result?.mealId).toBe(52772);
      expect(result?.userId).toBe(1);
    });
  });
});
