import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanWeekCreate } from './plan-week-create';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../../services/storage-service';
import { ApiService } from '../../services/api-service';

describe('PlanWeekCreate', () => {
  let component: PlanWeekCreate;
  let fixture: ComponentFixture<PlanWeekCreate>;

  const mockUserRecipes = [
    { idMeal: '1', strMeal: 'Paella' },
    { idMeal: '2', strMeal: 'Tortilla' },
    { idMeal: '3', strMeal: 'Gazpacho' },
  ];

  const mockStorageService = {
    getUserSession: vi.fn().mockReturnValue({ id: '1', username: 'testuser' }),
    getUserMeals: vi.fn().mockReturnValue([]),
    saveWeeklyPlan: vi.fn(),
  };

  const mockApiService = {
    getMealDetails: vi.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanWeekCreate],
      providers: [
        { provide: StorageService, useValue: mockStorageService },
        { provide: ApiService, useValue: mockApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanWeekCreate);
    component = fixture.componentInstance;

    // Mock de las propiedades necesarias
    component.userRecipes.set(mockUserRecipes as any);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render table with 5 weekdays (Lunes to Viernes) and each day has a select', () => {
    const diasEsperados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

    // Verificar que los encabezados de la tabla contienen los días de la semana
    const tableHeaders = fixture.nativeElement.querySelectorAll('thead th');

    // El primer th es "Comida", los siguientes 5 son los días
    expect(tableHeaders.length).toBe(6); // 1 (Comida) + 5 días

    // Verificar que cada día está presente en los encabezados
    diasEsperados.forEach((dia, index) => {
      const headerText = tableHeaders[index + 1].textContent.toLowerCase().trim();
      expect(headerText).toBe(dia);
    });

    // Verificar que hay 2 filas en tbody (Mañana y Noche)
    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);

    // Verificar que cada fila tiene 5 selects (uno por día)
    tableRows.forEach((row: HTMLElement) => {
      const selects = row.querySelectorAll('select');
      expect(selects.length).toBe(5);
    });
  });

  it('should populate all 10 selects with user favorite recipes', () => {
    // Obtener todos los selects de la tabla
    const allSelects = fixture.nativeElement.querySelectorAll('tbody select');

    // Verificar que hay exactamente 10 selects (5 días x 2 comidas)
    expect(allSelects.length).toBe(10);

    // Verificar que cada select contiene las recetas del usuario
    allSelects.forEach((select: HTMLSelectElement) => {
      const options = select.querySelectorAll('option');

      // Primera opción es "-- Sin asignar --" + las recetas del usuario
      expect(options.length).toBe(mockUserRecipes.length + 1);

      // Verificar que la primera opción es el placeholder
      expect(options[0].textContent?.trim()).toBe('-- Sin asignar --');
      expect(options[0].value).toBe('');

      // Verificar que las recetas están presentes
      mockUserRecipes.forEach((recipe, index) => {
        expect(options[index + 1].value).toBe(recipe.idMeal);
        expect(options[index + 1].textContent?.trim()).toBe(recipe.strMeal);
      });
    });
  });
});
