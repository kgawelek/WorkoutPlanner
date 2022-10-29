import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WorkoutRatingFormService, WorkoutRatingFormGroup } from './workout-rating-form.service';
import { IWorkoutRating } from '../workout-rating.model';
import { WorkoutRatingService } from '../service/workout-rating.service';
import { RatingScale } from 'app/entities/enumerations/rating-scale.model';

@Component({
  selector: 'jhi-workout-rating-update',
  templateUrl: './workout-rating-update.component.html',
})
export class WorkoutRatingUpdateComponent implements OnInit {
  isSaving = false;
  workoutRating: IWorkoutRating | null = null;
  ratingScaleValues = Object.keys(RatingScale);

  editForm: WorkoutRatingFormGroup = this.workoutRatingFormService.createWorkoutRatingFormGroup();

  constructor(
    protected workoutRatingService: WorkoutRatingService,
    protected workoutRatingFormService: WorkoutRatingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workoutRating }) => {
      this.workoutRating = workoutRating;
      if (workoutRating) {
        this.updateForm(workoutRating);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workoutRating = this.workoutRatingFormService.getWorkoutRating(this.editForm);
    if (workoutRating.id !== null) {
      this.subscribeToSaveResponse(this.workoutRatingService.update(workoutRating));
    } else {
      this.subscribeToSaveResponse(this.workoutRatingService.create(workoutRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkoutRating>>): void {
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

  protected updateForm(workoutRating: IWorkoutRating): void {
    this.workoutRating = workoutRating;
    this.workoutRatingFormService.resetForm(this.editForm, workoutRating);
  }
}
