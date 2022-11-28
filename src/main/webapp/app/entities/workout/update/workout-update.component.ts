import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WorkoutFormService, WorkoutFormGroup } from './workout-form.service';
import { IWorkout } from '../workout.model';
import { WorkoutService } from '../service/workout.service';
import { IWorkoutRating } from 'app/entities/workout-rating/workout-rating.model';
import { WorkoutRatingService } from 'app/entities/workout-rating/service/workout-rating.service';
import { ISportDiscipline } from 'app/entities/sport-discipline/sport-discipline.model';
import { SportDisciplineService } from 'app/entities/sport-discipline/service/sport-discipline.service';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';
import { Status } from 'app/entities/enumerations/status.model';
import { WorkoutType } from 'app/entities/enumerations/workout-type.model';
import { IExerciseType } from '../../exercise-type/exercise-type.model';
import { ExerciseFormGroup, ExerciseFormService } from '../../exercise/update/exercise-form.service';
import { ExerciseTypeService } from '../../exercise-type/service/exercise-type.service';
import { ExerciseService } from '../../exercise/service/exercise.service';
import { IExercise } from '../../exercise/exercise.model';

@Component({
  selector: 'jhi-workout-update',
  templateUrl: './workout-update.component.html',
})
export class WorkoutUpdateComponent implements OnInit {
  isSaving = false;
  workout: IWorkout | null = null;
  statusValues = Object.keys(Status);
  workoutTypeValues = Object.keys(WorkoutType);

  workoutRatingsCollection: IWorkoutRating[] = [];
  sportDisciplinesSharedCollection: ISportDiscipline[] = [];
  userDetailsSharedCollection: IUserDetails[] = [];

  editForm: WorkoutFormGroup = this.workoutFormService.createWorkoutFormGroup();

  exerciseTypesSharedCollection: IExerciseType[] = [];

  addExerciseForm: ExerciseFormGroup = this.exerciseFormService.createExerciseFormGroup();

  constructor(
    protected workoutService: WorkoutService,
    protected workoutFormService: WorkoutFormService,
    protected workoutRatingService: WorkoutRatingService,
    protected sportDisciplineService: SportDisciplineService,
    protected userDetailsService: UserDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected exerciseFormService: ExerciseFormService,
    protected exerciseTypeService: ExerciseTypeService,
    protected exerciseService: ExerciseService
  ) {}

  compareExerciseType = (o1: IExerciseType | null, o2: IExerciseType | null): boolean =>
    this.exerciseTypeService.compareExerciseType(o1, o2);

  compareWorkout = (o1: IWorkout | null, o2: IWorkout | null): boolean => this.workoutService.compareWorkout(o1, o2);

  compareWorkoutRating = (o1: IWorkoutRating | null, o2: IWorkoutRating | null): boolean =>
    this.workoutRatingService.compareWorkoutRating(o1, o2);

  compareSportDiscipline = (o1: ISportDiscipline | null, o2: ISportDiscipline | null): boolean =>
    this.sportDisciplineService.compareSportDiscipline(o1, o2);

  compareUserDetails = (o1: IUserDetails | null, o2: IUserDetails | null): boolean => this.userDetailsService.compareUserDetails(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workout }) => {
      this.workout = workout;
      if (workout) {
        this.updateForm(workout);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workout = this.workoutFormService.getWorkout(this.editForm);
    if (workout.id !== null) {
      this.subscribeToSaveResponse(this.workoutService.update(workout));
    } else {
      this.subscribeToSaveResponse(this.workoutService.create(workout));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkout>>): void {
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

  protected updateForm(workout: IWorkout): void {
    this.workout = workout;
    this.workoutFormService.resetForm(this.editForm, workout);

    this.workoutRatingsCollection = this.workoutRatingService.addWorkoutRatingToCollectionIfMissing<IWorkoutRating>(
      this.workoutRatingsCollection,
      workout.workoutRating
    );
    this.sportDisciplinesSharedCollection = this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(
      this.sportDisciplinesSharedCollection,
      workout.sportDiscipline
    );
    this.userDetailsSharedCollection = this.userDetailsService.addUserDetailsToCollectionIfMissing<IUserDetails>(
      this.userDetailsSharedCollection,
      workout.userDetails
    );
  }

  protected loadRelationshipsOptions(): void {
    this.workoutRatingService
      .query({ filter: 'workout-is-null' })
      .pipe(map((res: HttpResponse<IWorkoutRating[]>) => res.body ?? []))
      .pipe(
        map((workoutRatings: IWorkoutRating[]) =>
          this.workoutRatingService.addWorkoutRatingToCollectionIfMissing<IWorkoutRating>(workoutRatings, this.workout?.workoutRating)
        )
      )
      .subscribe((workoutRatings: IWorkoutRating[]) => (this.workoutRatingsCollection = workoutRatings));

    this.sportDisciplineService
      .query()
      .pipe(map((res: HttpResponse<ISportDiscipline[]>) => res.body ?? []))
      .pipe(
        map((sportDisciplines: ISportDiscipline[]) =>
          this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(
            sportDisciplines,
            this.workout?.sportDiscipline
          )
        )
      )
      .subscribe((sportDisciplines: ISportDiscipline[]) => (this.sportDisciplinesSharedCollection = sportDisciplines));

    this.userDetailsService
      .query()
      .pipe(map((res: HttpResponse<IUserDetails[]>) => res.body ?? []))
      .pipe(
        map((userDetails: IUserDetails[]) =>
          this.userDetailsService.addUserDetailsToCollectionIfMissing<IUserDetails>(userDetails, this.workout?.userDetails)
        )
      )
      .subscribe((userDetails: IUserDetails[]) => (this.userDetailsSharedCollection = userDetails));

    this.exerciseTypeService
      .query()
      .pipe(map((res: HttpResponse<IExerciseType[]>) => res.body ?? []))
      .subscribe((exerciseTypes: IExerciseType[]) => (this.exerciseTypesSharedCollection = exerciseTypes));
  }

  addExercise() {
    this.isSaving = true;
    const exercise = this.exerciseFormService.getExercise(this.addExerciseForm);
    exercise.workout = this.workout;
    if (exercise.id !== null) {
      this.subscribeToSaveResponse(this.exerciseService.update(exercise));
    } else {
      this.subscribeToSaveResponse(this.exerciseService.create(exercise));
    }
  }
}
