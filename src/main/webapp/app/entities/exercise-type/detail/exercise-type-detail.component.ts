import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExerciseType } from '../exercise-type.model';

@Component({
  selector: 'jhi-exercise-type-detail',
  templateUrl: './exercise-type-detail.component.html',
})
export class ExerciseTypeDetailComponent implements OnInit {
  exerciseType: IExerciseType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerciseType }) => {
      this.exerciseType = exerciseType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
