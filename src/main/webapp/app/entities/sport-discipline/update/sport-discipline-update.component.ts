import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SportDisciplineFormService, SportDisciplineFormGroup } from './sport-discipline-form.service';
import { ISportDiscipline } from '../sport-discipline.model';
import { SportDisciplineService } from '../service/sport-discipline.service';

@Component({
  selector: 'jhi-sport-discipline-update',
  templateUrl: './sport-discipline-update.component.html',
})
export class SportDisciplineUpdateComponent implements OnInit {
  isSaving = false;
  sportDiscipline: ISportDiscipline | null = null;

  editForm: SportDisciplineFormGroup = this.sportDisciplineFormService.createSportDisciplineFormGroup();

  constructor(
    protected sportDisciplineService: SportDisciplineService,
    protected sportDisciplineFormService: SportDisciplineFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sportDiscipline }) => {
      this.sportDiscipline = sportDiscipline;
      if (sportDiscipline) {
        this.updateForm(sportDiscipline);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sportDiscipline = this.sportDisciplineFormService.getSportDiscipline(this.editForm);
    if (sportDiscipline.id !== null) {
      this.subscribeToSaveResponse(this.sportDisciplineService.update(sportDiscipline));
    } else {
      this.subscribeToSaveResponse(this.sportDisciplineService.create(sportDiscipline));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISportDiscipline>>): void {
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

  protected updateForm(sportDiscipline: ISportDiscipline): void {
    this.sportDiscipline = sportDiscipline;
    this.sportDisciplineFormService.resetForm(this.editForm, sportDiscipline);
  }
}
