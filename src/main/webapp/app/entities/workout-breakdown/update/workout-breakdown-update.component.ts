import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WorkoutBreakdownFormService, WorkoutBreakdownFormGroup } from './workout-breakdown-form.service';
import { IWorkoutBreakdown } from '../workout-breakdown.model';
import { WorkoutBreakdownService } from '../service/workout-breakdown.service';
import { IWorkout } from 'app/entities/workout/workout.model';
import { WorkoutService } from 'app/entities/workout/service/workout.service';

@Component({
  selector: 'jhi-workout-breakdown-update',
  templateUrl: './workout-breakdown-update.component.html',
})
export class WorkoutBreakdownUpdateComponent implements OnInit {
  isSaving = false;
  workoutBreakdown: IWorkoutBreakdown | null = null;

  workoutsSharedCollection: IWorkout[] = [];

  editForm: WorkoutBreakdownFormGroup = this.workoutBreakdownFormService.createWorkoutBreakdownFormGroup();

  constructor(
    protected workoutBreakdownService: WorkoutBreakdownService,
    protected workoutBreakdownFormService: WorkoutBreakdownFormService,
    protected workoutService: WorkoutService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareWorkout = (o1: IWorkout | null, o2: IWorkout | null): boolean => this.workoutService.compareWorkout(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workoutBreakdown }) => {
      this.workoutBreakdown = workoutBreakdown;
      if (workoutBreakdown) {
        this.updateForm(workoutBreakdown);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workoutBreakdown = this.workoutBreakdownFormService.getWorkoutBreakdown(this.editForm);
    if (workoutBreakdown.id !== null) {
      this.subscribeToSaveResponse(this.workoutBreakdownService.update(workoutBreakdown));
    } else {
      this.subscribeToSaveResponse(this.workoutBreakdownService.create(workoutBreakdown));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkoutBreakdown>>): void {
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

  protected updateForm(workoutBreakdown: IWorkoutBreakdown): void {
    this.workoutBreakdown = workoutBreakdown;
    this.workoutBreakdownFormService.resetForm(this.editForm, workoutBreakdown);

    this.workoutsSharedCollection = this.workoutService.addWorkoutToCollectionIfMissing<IWorkout>(
      this.workoutsSharedCollection,
      workoutBreakdown.workout
    );
  }

  protected loadRelationshipsOptions(): void {
    this.workoutService
      .query()
      .pipe(map((res: HttpResponse<IWorkout[]>) => res.body ?? []))
      .pipe(
        map((workouts: IWorkout[]) =>
          this.workoutService.addWorkoutToCollectionIfMissing<IWorkout>(workouts, this.workoutBreakdown?.workout)
        )
      )
      .subscribe((workouts: IWorkout[]) => (this.workoutsSharedCollection = workouts));
  }
}
