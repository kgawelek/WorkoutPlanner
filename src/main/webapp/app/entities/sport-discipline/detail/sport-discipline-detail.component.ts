import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISportDiscipline } from '../sport-discipline.model';

@Component({
  selector: 'jhi-sport-discipline-detail',
  templateUrl: './sport-discipline-detail.component.html',
})
export class SportDisciplineDetailComponent implements OnInit {
  sportDiscipline: ISportDiscipline | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sportDiscipline }) => {
      this.sportDiscipline = sportDiscipline;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
