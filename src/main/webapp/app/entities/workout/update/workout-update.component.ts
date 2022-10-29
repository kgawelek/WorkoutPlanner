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
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';
import { Status } from 'app/entities/enumerations/status.model';
import { WorkoutType } from 'app/entities/enumerations/workout-type.model';

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
  userDetailsSharedCollection: IUserDetails[] = [];

  editForm: WorkoutFormGroup = this.workoutFormService.createWorkoutFormGroup();

  constructor(
    protected workoutService: WorkoutService,
    protected workoutFormService: WorkoutFormService,
    protected workoutRatingService: WorkoutRatingService,
    protected userDetailsService: UserDetailsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareWorkoutRating = (o1: IWorkoutRating | null, o2: IWorkoutRating | null): boolean =>
    this.workoutRatingService.compareWorkoutRating(o1, o2);

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

    this.userDetailsService
      .query()
      .pipe(map((res: HttpResponse<IUserDetails[]>) => res.body ?? []))
      .pipe(
        map((userDetails: IUserDetails[]) =>
          this.userDetailsService.addUserDetailsToCollectionIfMissing<IUserDetails>(userDetails, this.workout?.userDetails)
        )
      )
      .subscribe((userDetails: IUserDetails[]) => (this.userDetailsSharedCollection = userDetails));
  }
}
