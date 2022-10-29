import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../workout-rating.test-samples';

import { WorkoutRatingFormService } from './workout-rating-form.service';

describe('WorkoutRating Form Service', () => {
  let service: WorkoutRatingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutRatingFormService);
  });

  describe('Service methods', () => {
    describe('createWorkoutRatingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWorkoutRatingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            comment: expect.any(Object),
            rate: expect.any(Object),
          })
        );
      });

      it('passing IWorkoutRating should create a new form with FormGroup', () => {
        const formGroup = service.createWorkoutRatingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            comment: expect.any(Object),
            rate: expect.any(Object),
          })
        );
      });
    });

    describe('getWorkoutRating', () => {
      it('should return NewWorkoutRating for default WorkoutRating initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWorkoutRatingFormGroup(sampleWithNewData);

        const workoutRating = service.getWorkoutRating(formGroup) as any;

        expect(workoutRating).toMatchObject(sampleWithNewData);
      });

      it('should return NewWorkoutRating for empty WorkoutRating initial value', () => {
        const formGroup = service.createWorkoutRatingFormGroup();

        const workoutRating = service.getWorkoutRating(formGroup) as any;

        expect(workoutRating).toMatchObject({});
      });

      it('should return IWorkoutRating', () => {
        const formGroup = service.createWorkoutRatingFormGroup(sampleWithRequiredData);

        const workoutRating = service.getWorkoutRating(formGroup) as any;

        expect(workoutRating).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWorkoutRating should not enable id FormControl', () => {
        const formGroup = service.createWorkoutRatingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWorkoutRating should disable id FormControl', () => {
        const formGroup = service.createWorkoutRatingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
