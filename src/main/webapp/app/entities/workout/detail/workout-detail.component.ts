import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkout } from '../workout.model';
import { IWorkoutBreakdown } from '../../workout-breakdown/workout-breakdown.model';
import { IExercise } from '../../exercise/exercise.model';

@Component({
  selector: 'jhi-workout-detail',
  templateUrl: './workout-detail.component.html',
})
export class WorkoutDetailComponent implements OnInit {
  workout: IWorkout | null = null;
  intervals: IWorkoutBreakdown[] = [];
  exercises: IExercise[] = [];

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workout }) => {
      this.workout = workout;
      this.intervals = Array.from(workout.workoutBreakdowns);
      // @ts-ignore
      this.intervals = this.intervals.sort((a, b) => a.order - b.order);

      this.exercises = Array.from(workout.exercises);
      // @ts-ignore
      this.exercises = this.exercises.sort((a, b) => a.order - b.order);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
