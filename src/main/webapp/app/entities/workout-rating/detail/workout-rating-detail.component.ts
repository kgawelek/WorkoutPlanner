import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkoutRating } from '../workout-rating.model';

@Component({
  selector: 'jhi-workout-rating-detail',
  templateUrl: './workout-rating-detail.component.html',
})
export class WorkoutRatingDetailComponent implements OnInit {
  workoutRating: IWorkoutRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workoutRating }) => {
      this.workoutRating = workoutRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
