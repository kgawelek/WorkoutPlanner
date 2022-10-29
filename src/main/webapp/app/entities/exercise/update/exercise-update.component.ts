import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExerciseFormService, ExerciseFormGroup } from './exercise-form.service';
import { IExercise } from '../exercise.model';
import { ExerciseService } from '../service/exercise.service';
import { IExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { ExerciseTypeService } from 'app/entities/exercise-type/service/exercise-type.service';
import { IWorkout } from 'app/entities/workout/workout.model';
import { WorkoutService } from 'app/entities/workout/service/workout.service';

@Component({
  selector: 'jhi-exercise-update',
  templateUrl: './exercise-update.component.html',
})
export class ExerciseUpdateComponent implements OnInit {
  isSaving = false;
  exercise: IExercise | null = null;

  exerciseTypesSharedCollection: IExerciseType[] = [];
  workoutsSharedCollection: IWorkout[] = [];

  editForm: ExerciseFormGroup = this.exerciseFormService.createExerciseFormGroup();

  constructor(
    protected exerciseService: ExerciseService,
    protected exerciseFormService: ExerciseFormService,
    protected exerciseTypeService: ExerciseTypeService,
    protected workoutService: WorkoutService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareExerciseType = (o1: IExerciseType | null, o2: IExerciseType | null): boolean =>
    this.exerciseTypeService.compareExerciseType(o1, o2);

  compareWorkout = (o1: IWorkout | null, o2: IWorkout | null): boolean => this.workoutService.compareWorkout(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exercise }) => {
      this.exercise = exercise;
      if (exercise) {
        this.updateForm(exercise);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exercise = this.exerciseFormService.getExercise(this.editForm);
    if (exercise.id !== null) {
      this.subscribeToSaveResponse(this.exerciseService.update(exercise));
    } else {
      this.subscribeToSaveResponse(this.exerciseService.create(exercise));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExercise>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(exercise: IExercise): void {
    this.exercise = exercise;
    this.exerciseFormService.resetForm(this.editForm, exercise);

    this.exerciseTypesSharedCollection = this.exerciseTypeService.addExerciseTypeToCollectionIfMissing<IExerciseType>(
      this.exerciseTypesSharedCollection,
      exercise.exerciseType
    );
    this.workoutsSharedCollection = this.workoutService.addWorkoutToCollectionIfMissing<IWorkout>(
      this.workoutsSharedCollection,
      exercise.workout
    );
  }

  protected loadRelationshipsOptions(): void {
    this.exerciseTypeService
      .query()
      .pipe(map((res: HttpResponse<IExerciseType[]>) => res.body ?? []))
      .pipe(
        map((exerciseTypes: IExerciseType[]) =>
          this.exerciseTypeService.addExerciseTypeToCollectionIfMissing<IExerciseType>(exerciseTypes, this.exercise?.exerciseType)
        )
      )
      .subscribe((exerciseTypes: IExerciseType[]) => (this.exerciseTypesSharedCollection = exerciseTypes));

    this.workoutService
      .query()
      .pipe(map((res: HttpResponse<IWorkout[]>) => res.body ?? []))
      .pipe(map((workouts: IWorkout[]) => this.workoutService.addWorkoutToCollectionIfMissing<IWorkout>(workouts, this.exercise?.workout)))
      .subscribe((workouts: IWorkout[]) => (this.workoutsSharedCollection = workouts));
  }
}
