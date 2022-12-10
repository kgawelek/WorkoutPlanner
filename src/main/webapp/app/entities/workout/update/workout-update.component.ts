import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
import { RatingScale } from 'app/entities/enumerations/rating-scale.model';
import { IExerciseType } from '../../exercise-type/exercise-type.model';
import { ExerciseFormGroup, ExerciseFormService } from '../../exercise/update/exercise-form.service';
import { ExerciseTypeService } from '../../exercise-type/service/exercise-type.service';
import { EntityArrayResponseType, ExerciseService } from '../../exercise/service/exercise.service';
import { IExercise } from '../../exercise/exercise.model';
import { ExerciseDeleteDialogComponent } from '../../exercise/delete/exercise-delete-dialog.component';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkoutBreakdownService } from '../../workout-breakdown/service/workout-breakdown.service';
import { WorkoutBreakdownFormGroup, WorkoutBreakdownFormService } from '../../workout-breakdown/update/workout-breakdown-form.service';
import { IWorkoutBreakdown } from '../../workout-breakdown/workout-breakdown.model';
import { WorkoutRatingFormGroup, WorkoutRatingFormService } from '../../workout-rating/update/workout-rating-form.service';

@Component({
  selector: 'jhi-workout-update',
  templateUrl: './workout-update.component.html',
})
export class WorkoutUpdateComponent implements OnInit {
  isSaving = false;
  workout: IWorkout | null = null;
  statusValues = Object.keys(Status);
  workoutTypeValues = Object.keys(WorkoutType);
  ratingScaleValues = Object.keys(RatingScale);

  workoutRatingsCollection: IWorkoutRating[] = [];
  sportDisciplinesSharedCollection: ISportDiscipline[] = [];
  userDetailsSharedCollection: IUserDetails[] = [];

  intervals: IWorkoutBreakdown[] = [];
  exercises: IExercise[] = [];

  editForm: WorkoutFormGroup = this.workoutFormService.createWorkoutFormGroup();

  exerciseTypesSharedCollection: IExerciseType[] = [];

  addExerciseForm: ExerciseFormGroup = this.exerciseFormService.createExerciseFormGroup();
  addIntervalForm: WorkoutBreakdownFormGroup = this.workoutBreakdownFormService.createWorkoutBreakdownFormGroup();
  ratingForm: WorkoutRatingFormGroup = this.workoutRatingFormService.createWorkoutRatingFormGroup();

  constructor(
    protected workoutService: WorkoutService,
    protected workoutFormService: WorkoutFormService,
    protected workoutRatingService: WorkoutRatingService,
    protected sportDisciplineService: SportDisciplineService,
    protected userDetailsService: UserDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected exerciseFormService: ExerciseFormService,
    protected exerciseTypeService: ExerciseTypeService,
    protected exerciseService: ExerciseService,
    protected modalService: NgbModal,
    protected workoutBreakdownService: WorkoutBreakdownService,
    protected workoutBreakdownFormService: WorkoutBreakdownFormService,
    protected workoutRatingFormService: WorkoutRatingFormService
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
      workout.duration = workout.duration.replace('PT', '');
      this.workout = workout;
      if (workout) {
        this.updateForm(workout);
        this.intervals = Array.from(workout.workoutBreakdowns);
        // @ts-ignore
        this.intervals = this.intervals.sort((a, b) => a.order - b.order);

        this.exercises = Array.from(workout.exercises);
        // @ts-ignore
        this.exercises = this.exercises.sort((a, b) => a.order - b.order);
      }

      this.loadRelationshipsOptions();
    });
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
    this.sportDisciplinesSharedCollection = this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(
      this.sportDisciplinesSharedCollection
    );
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workout = this.workoutFormService.getWorkout(this.editForm);
    if (workout.workoutRating == null) {
      const workoutRating = this.workoutRatingFormService.getWorkoutRating(this.ratingForm);
      // @ts-ignore
      workout.workoutRating = workoutRating;
    }
    if (!workout.duration?.match('PT')) {
      workout.duration = 'PT' + workout.duration;
    }
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

  protected subscribeToSaveResponseAndReloadPage(result: Observable<HttpResponse<any>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => window.location.reload(),
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
    if (!this.workout?.duration?.match('PT')) {
      // @ts-ignore
      this.workout.duration = 'PT' + this.workout?.duration;
    }
    exercise.workout = this.workout;
    if (exercise.id !== null) {
      this.subscribeToSaveResponseAndReloadPage(this.exerciseService.update(exercise));
    } else {
      this.subscribeToSaveResponseAndReloadPage(this.exerciseService.create(exercise));
    }
    // @ts-ignore
    this.workout.duration = this.workout?.duration.replace('PT', '');
  }

  deleteExercise(exercise: IExercise, event: any): void {
    event.preventDefault();
    const modalRef = this.modalService.open(ExerciseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.exercise = exercise;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe({
      next: (res: EntityArrayResponseType) => {
        window.location.reload();
      },
    });
  }

  addInterval() {
    this.isSaving = true;
    const workoutBreakdown = this.workoutBreakdownFormService.getWorkoutBreakdown(this.addIntervalForm);
    if (!this.workout?.duration?.match('PT')) {
      // @ts-ignore
      this.workout.duration = 'PT' + this.workout?.duration;
    }
    workoutBreakdown.workout = this.workout;
    if (workoutBreakdown.id !== null) {
      this.subscribeToSaveResponseAndReloadPage(this.workoutBreakdownService.update(workoutBreakdown));
    } else {
      this.subscribeToSaveResponseAndReloadPage(this.workoutBreakdownService.create(workoutBreakdown));
    }
    // @ts-ignore
    this.workout.duration = this.workout?.duration.replace('PT', '');
  }
}
