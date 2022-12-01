import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../workout-breakdown.test-samples';

import { WorkoutBreakdownFormService } from './workout-breakdown-form.service';

describe('WorkoutBreakdown Form Service', () => {
  let service: WorkoutBreakdownFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutBreakdownFormService);
  });

  describe('Service methods', () => {
    describe('createWorkoutBreakdownFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWorkoutBreakdownFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            distance: expect.any(Object),
            duration: expect.any(Object),
            distanceUnit: expect.any(Object),
            notes: expect.any(Object),
            minValue: expect.any(Object),
            maxValue: expect.any(Object),
            rangeUnit: expect.any(Object),
            order: expect.any(Object),
            workout: expect.any(Object),
          })
        );
      });

      it('passing IWorkoutBreakdown should create a new form with FormGroup', () => {
        const formGroup = service.createWorkoutBreakdownFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            distance: expect.any(Object),
            duration: expect.any(Object),
            distanceUnit: expect.any(Object),
            notes: expect.any(Object),
            minValue: expect.any(Object),
            maxValue: expect.any(Object),
            rangeUnit: expect.any(Object),
            order: expect.any(Object),
            workout: expect.any(Object),
          })
        );
      });
    });

    describe('getWorkoutBreakdown', () => {
      it('should return NewWorkoutBreakdown for default WorkoutBreakdown initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWorkoutBreakdownFormGroup(sampleWithNewData);

        const workoutBreakdown = service.getWorkoutBreakdown(formGroup) as any;

        expect(workoutBreakdown).toMatchObject(sampleWithNewData);
      });

      it('should return NewWorkoutBreakdown for empty WorkoutBreakdown initial value', () => {
        const formGroup = service.createWorkoutBreakdownFormGroup();

        const workoutBreakdown = service.getWorkoutBreakdown(formGroup) as any;

        expect(workoutBreakdown).toMatchObject({});
      });

      it('should return IWorkoutBreakdown', () => {
        const formGroup = service.createWorkoutBreakdownFormGroup(sampleWithRequiredData);

        const workoutBreakdown = service.getWorkoutBreakdown(formGroup) as any;

        expect(workoutBreakdown).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWorkoutBreakdown should not enable id FormControl', () => {
        const formGroup = service.createWorkoutBreakdownFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWorkoutBreakdown should disable id FormControl', () => {
        const formGroup = service.createWorkoutBreakdownFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
