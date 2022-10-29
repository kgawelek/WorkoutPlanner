import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IWorkoutRating, NewWorkoutRating } from '../workout-rating.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWorkoutRating for edit and NewWorkoutRatingFormGroupInput for create.
 */
type WorkoutRatingFormGroupInput = IWorkoutRating | PartialWithRequiredKeyOf<NewWorkoutRating>;

type WorkoutRatingFormDefaults = Pick<NewWorkoutRating, 'id'>;

type WorkoutRatingFormGroupContent = {
  id: FormControl<IWorkoutRating['id'] | NewWorkoutRating['id']>;
  comment: FormControl<IWorkoutRating['comment']>;
  rate: FormControl<IWorkoutRating['rate']>;
};

export type WorkoutRatingFormGroup = FormGroup<WorkoutRatingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WorkoutRatingFormService {
  createWorkoutRatingFormGroup(workoutRating: WorkoutRatingFormGroupInput = { id: null }): WorkoutRatingFormGroup {
    const workoutRatingRawValue = {
      ...this.getFormDefaults(),
      ...workoutRating,
    };
    return new FormGroup<WorkoutRatingFormGroupContent>({
      id: new FormControl(
        { value: workoutRatingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      comment: new FormControl(workoutRatingRawValue.comment),
      rate: new FormControl(workoutRatingRawValue.rate),
    });
  }

  getWorkoutRating(form: WorkoutRatingFormGroup): IWorkoutRating | NewWorkoutRating {
    return form.getRawValue() as IWorkoutRating | NewWorkoutRating;
  }

  resetForm(form: WorkoutRatingFormGroup, workoutRating: WorkoutRatingFormGroupInput): void {
    const workoutRatingRawValue = { ...this.getFormDefaults(), ...workoutRating };
    form.reset(
      {
        ...workoutRatingRawValue,
        id: { value: workoutRatingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WorkoutRatingFormDefaults {
    return {
      id: null,
    };
  }
}
