import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWorkout, NewWorkout } from '../workout.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWorkout for edit and NewWorkoutFormGroupInput for create.
 */
type WorkoutFormGroupInput = IWorkout | PartialWithRequiredKeyOf<NewWorkout>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IWorkout | NewWorkout> = Omit<T, 'date'> & {
  date?: string | null;
};

type WorkoutFormRawValue = FormValueOf<IWorkout>;

type NewWorkoutFormRawValue = FormValueOf<NewWorkout>;

type WorkoutFormDefaults = Pick<NewWorkout, 'id' | 'date'>;

type WorkoutFormGroupContent = {
  id: FormControl<WorkoutFormRawValue['id'] | NewWorkout['id']>;
  date: FormControl<WorkoutFormRawValue['date']>;
  duration: FormControl<WorkoutFormRawValue['duration']>;
  comment: FormControl<WorkoutFormRawValue['comment']>;
  status: FormControl<WorkoutFormRawValue['status']>;
  type: FormControl<WorkoutFormRawValue['type']>;
  workoutRating: FormControl<WorkoutFormRawValue['workoutRating']>;
  sportDiscipline: FormControl<WorkoutFormRawValue['sportDiscipline']>;
  userDetails: FormControl<WorkoutFormRawValue['userDetails']>;
};

export type WorkoutFormGroup = FormGroup<WorkoutFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WorkoutFormService {
  createWorkoutFormGroup(workout: WorkoutFormGroupInput = { id: null }): WorkoutFormGroup {
    const workoutRawValue = this.convertWorkoutToWorkoutRawValue({
      ...this.getFormDefaults(),
      ...workout,
    });
    return new FormGroup<WorkoutFormGroupContent>({
      id: new FormControl(
        { value: workoutRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(workoutRawValue.date),
      duration: new FormControl(workoutRawValue.duration),
      comment: new FormControl(workoutRawValue.comment),
      status: new FormControl(workoutRawValue.status),
      type: new FormControl(workoutRawValue.type),
      workoutRating: new FormControl(workoutRawValue.workoutRating),
      sportDiscipline: new FormControl(workoutRawValue.sportDiscipline),
      userDetails: new FormControl(workoutRawValue.userDetails),
    });
  }

  getWorkout(form: WorkoutFormGroup): IWorkout | NewWorkout {
    return this.convertWorkoutRawValueToWorkout(form.getRawValue() as WorkoutFormRawValue | NewWorkoutFormRawValue);
  }

  resetForm(form: WorkoutFormGroup, workout: WorkoutFormGroupInput): void {
    const workoutRawValue = this.convertWorkoutToWorkoutRawValue({ ...this.getFormDefaults(), ...workout });
    form.reset(
      {
        ...workoutRawValue,
        id: { value: workoutRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WorkoutFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertWorkoutRawValueToWorkout(rawWorkout: WorkoutFormRawValue | NewWorkoutFormRawValue): IWorkout | NewWorkout {
    return {
      ...rawWorkout,
      date: dayjs(rawWorkout.date, DATE_TIME_FORMAT),
    };
  }

  private convertWorkoutToWorkoutRawValue(
    workout: IWorkout | (Partial<NewWorkout> & WorkoutFormDefaults)
  ): WorkoutFormRawValue | PartialWithRequiredKeyOf<NewWorkoutFormRawValue> {
    return {
      ...workout,
      date: workout.date ? workout.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
