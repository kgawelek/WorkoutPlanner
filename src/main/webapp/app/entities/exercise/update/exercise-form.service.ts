import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExercise, NewExercise } from '../exercise.model';

type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExercise for edit and NewExerciseFormGroupInput for create.
 */
type ExerciseFormGroupInput = IExercise | PartialWithRequiredKeyOf<NewExercise>;

type ExerciseFormDefaults = Pick<NewExercise, 'id'>;

type ExerciseFormGroupContent = {
  id: FormControl<IExercise['id'] | NewExercise['id']>;
  nrOfReps: FormControl<IExercise['nrOfReps']>;
  nrOfSeries: FormControl<IExercise['nrOfSeries']>;
  weight: FormControl<IExercise['weight']>;
  order: FormControl<IExercise['order']>;
  exerciseType: FormControl<IExercise['exerciseType']>;
  workout: FormControl<IExercise['workout']>;
};

export type ExerciseFormGroup = FormGroup<ExerciseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerciseFormService {
  createExerciseFormGroup(exercise: ExerciseFormGroupInput = { id: null }): ExerciseFormGroup {
    const exerciseRawValue = {
      ...this.getFormDefaults(),
      ...exercise,
    };
    return new FormGroup<ExerciseFormGroupContent>({
      id: new FormControl(
        { value: exerciseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nrOfReps: new FormControl(exerciseRawValue.nrOfReps),
      nrOfSeries: new FormControl(exerciseRawValue.nrOfSeries),
      weight: new FormControl(exerciseRawValue.weight),
      order: new FormControl(exerciseRawValue.order),
      exerciseType: new FormControl(exerciseRawValue.exerciseType),
      workout: new FormControl(exerciseRawValue.workout),
    });
  }

  getExercise(form: ExerciseFormGroup): IExercise | NewExercise {
    return form.getRawValue() as IExercise | NewExercise;
  }

  resetForm(form: ExerciseFormGroup, exercise: ExerciseFormGroupInput): void {
    const exerciseRawValue = { ...this.getFormDefaults(), ...exercise };
    form.reset(
      {
        ...exerciseRawValue,
        id: { value: exerciseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExerciseFormDefaults {
    return {
      id: null,
    };
  }
}
