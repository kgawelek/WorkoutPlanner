import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExerciseType, NewExerciseType } from '../exercise-type.model';

type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExerciseType for edit and NewExerciseTypeFormGroupInput for create.
 */
type ExerciseTypeFormGroupInput = IExerciseType | PartialWithRequiredKeyOf<NewExerciseType>;

type ExerciseTypeFormDefaults = Pick<NewExerciseType, 'id'>;

type ExerciseTypeFormGroupContent = {
  id: FormControl<IExerciseType['id'] | NewExerciseType['id']>;
  name: FormControl<IExerciseType['name']>;
  description: FormControl<IExerciseType['description']>;
};

export type ExerciseTypeFormGroup = FormGroup<ExerciseTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerciseTypeFormService {
  createExerciseTypeFormGroup(exerciseType: ExerciseTypeFormGroupInput = { id: null }): ExerciseTypeFormGroup {
    const exerciseTypeRawValue = {
      ...this.getFormDefaults(),
      ...exerciseType,
    };
    return new FormGroup<ExerciseTypeFormGroupContent>({
      id: new FormControl(
        { value: exerciseTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(exerciseTypeRawValue.name),
      description: new FormControl(exerciseTypeRawValue.description),
    });
  }

  getExerciseType(form: ExerciseTypeFormGroup): IExerciseType | NewExerciseType {
    return form.getRawValue() as IExerciseType | NewExerciseType;
  }

  resetForm(form: ExerciseTypeFormGroup, exerciseType: ExerciseTypeFormGroupInput): void {
    const exerciseTypeRawValue = { ...this.getFormDefaults(), ...exerciseType };
    form.reset(
      {
        ...exerciseTypeRawValue,
        id: { value: exerciseTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExerciseTypeFormDefaults {
    return {
      id: null,
    };
  }
}
