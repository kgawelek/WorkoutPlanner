import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ExerciseTypeFormService, ExerciseTypeFormGroup } from './exercise-type-form.service';
import { IExerciseType } from '../exercise-type.model';
import { ExerciseTypeService } from '../service/exercise-type.service';

@Component({
  selector: 'jhi-exercise-type-update',
  templateUrl: './exercise-type-update.component.html',
})
export class ExerciseTypeUpdateComponent implements OnInit {
  isSaving = false;
  exerciseType: IExerciseType | null = null;

  editForm: ExerciseTypeFormGroup = this.exerciseTypeFormService.createExerciseTypeFormGroup();

  constructor(
    protected exerciseTypeService: ExerciseTypeService,
    protected exerciseTypeFormService: ExerciseTypeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerciseType }) => {
      this.exerciseType = exerciseType;
      if (exerciseType) {
        this.updateForm(exerciseType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exerciseType = this.exerciseTypeFormService.getExerciseType(this.editForm);
    if (exerciseType.id !== null) {
      this.subscribeToSaveResponse(this.exerciseTypeService.update(exerciseType));
    } else {
      this.subscribeToSaveResponse(this.exerciseTypeService.create(exerciseType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExerciseType>>): void {
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

  protected updateForm(exerciseType: IExerciseType): void {
    this.exerciseType = exerciseType;
    this.exerciseTypeFormService.resetForm(this.editForm, exerciseType);
  }
}
