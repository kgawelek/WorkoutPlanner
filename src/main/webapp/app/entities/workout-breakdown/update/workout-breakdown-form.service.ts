import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IWorkoutBreakdown, NewWorkoutBreakdown } from '../workout-breakdown.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWorkoutBreakdown for edit and NewWorkoutBreakdownFormGroupInput for create.
 */
type WorkoutBreakdownFormGroupInput = IWorkoutBreakdown | PartialWithRequiredKeyOf<NewWorkoutBreakdown>;

type WorkoutBreakdownFormDefaults = Pick<NewWorkoutBreakdown, 'id'>;

type WorkoutBreakdownFormGroupContent = {
  id: FormControl<IWorkoutBreakdown['id'] | NewWorkoutBreakdown['id']>;
  distance: FormControl<IWorkoutBreakdown['distance']>;
  duration: FormControl<IWorkoutBreakdown['duration']>;
  distanceUnit: FormControl<IWorkoutBreakdown['distanceUnit']>;
  notes: FormControl<IWorkoutBreakdown['notes']>;
  minValue: FormControl<IWorkoutBreakdown['minValue']>;
  maxValue: FormControl<IWorkoutBreakdown['maxValue']>;
  rangeUnit: FormControl<IWorkoutBreakdown['rangeUnit']>;
  workout: FormControl<IWorkoutBreakdown['workout']>;
};

export type WorkoutBreakdownFormGroup = FormGroup<WorkoutBreakdownFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WorkoutBreakdownFormService {
  createWorkoutBreakdownFormGroup(workoutBreakdown: WorkoutBreakdownFormGroupInput = { id: null }): WorkoutBreakdownFormGroup {
    const workoutBreakdownRawValue = {
      ...this.getFormDefaults(),
      ...workoutBreakdown,
    };
    return new FormGroup<WorkoutBreakdownFormGroupContent>({
      id: new FormControl(
        { value: workoutBreakdownRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      distance: new FormControl(workoutBreakdownRawValue.distance),
      duration: new FormControl(workoutBreakdownRawValue.duration),
      distanceUnit: new FormControl(workoutBreakdownRawValue.distanceUnit),
      notes: new FormControl(workoutBreakdownRawValue.notes),
      minValue: new FormControl(workoutBreakdownRawValue.minValue),
      maxValue: new FormControl(workoutBreakdownRawValue.maxValue),
      rangeUnit: new FormControl(workoutBreakdownRawValue.rangeUnit),
      workout: new FormControl(workoutBreakdownRawValue.workout),
    });
  }

  getWorkoutBreakdown(form: WorkoutBreakdownFormGroup): IWorkoutBreakdown | NewWorkoutBreakdown {
    return form.getRawValue() as IWorkoutBreakdown | NewWorkoutBreakdown;
  }

  resetForm(form: WorkoutBreakdownFormGroup, workoutBreakdown: WorkoutBreakdownFormGroupInput): void {
    const workoutBreakdownRawValue = { ...this.getFormDefaults(), ...workoutBreakdown };
    form.reset(
      {
        ...workoutBreakdownRawValue,
        id: { value: workoutBreakdownRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WorkoutBreakdownFormDefaults {
    return {
      id: null,
    };
  }
}
