import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkoutBreakdown } from '../workout-breakdown.model';

@Component({
  selector: 'jhi-workout-breakdown-detail',
  templateUrl: './workout-breakdown-detail.component.html',
})
export class WorkoutBreakdownDetailComponent implements OnInit {
  workoutBreakdown: IWorkoutBreakdown | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workoutBreakdown }) => {
      this.workoutBreakdown = workoutBreakdown;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
