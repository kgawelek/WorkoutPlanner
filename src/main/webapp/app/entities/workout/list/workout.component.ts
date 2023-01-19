import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';

import { IWorkout } from '../workout.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, WorkoutService } from '../service/workout.service';
import { WorkoutDeleteDialogComponent } from '../delete/workout-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { Status } from '../../enumerations/status.model';
import { WorkoutType } from '../../enumerations/workout-type.model';
import { ISportDiscipline } from '../../sport-discipline/sport-discipline.model';
import { SportDisciplineService } from '../../sport-discipline/service/sport-discipline.service';

@Component({
  selector: 'jhi-workout',
  templateUrl: './workout.component.html',
})
export class WorkoutComponent implements OnInit {
  workouts?: IWorkout[];
  filteredWorkouts?: IWorkout[];
  sportDisciplines?: ISportDiscipline[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  statusValues = Object.keys(Status);
  workoutTypeValues = Object.keys(WorkoutType);

  statusFilter = 'allWorkouts';
  typeFilter = 'allWorkouts';
  disciplineFilter = 'allWorkouts';

  constructor(
    protected workoutService: WorkoutService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected sportDisciplineService: SportDisciplineService
  ) {}

  trackId = (_index: number, item: IWorkout): number => this.workoutService.getWorkoutIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.loadSportDisciplines();
  }

  delete(workout: IWorkout): void {
    const modalRef = this.modalService.open(WorkoutDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.workout = workout;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.filteredWorkouts = this.refineData(dataFromBody);
    this.workouts = this.refineData(dataFromBody);
  }

  protected refineData(data: IWorkout[]): IWorkout[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IWorkout[] | null): IWorkout[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.workoutService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  protected loadSportDisciplines(): void {
    this.sportDisciplineService
      .query()
      .pipe(map((res: HttpResponse<ISportDiscipline[]>) => res.body ?? []))
      .pipe()
      .subscribe((sportDisciplines: ISportDiscipline[]) => (this.sportDisciplines = sportDisciplines));
  }

  statusFilterChanged(event: any) {
    this.statusFilter = event.target.value;
    this.filterWorkouts();
    if (!this.disciplineFilter.match('allWorkouts')) this.filterByDiscipline();
  }

  typeFilterChanged(event: any) {
    this.typeFilter = event.target.value;
    this.filterWorkouts();
    if (!this.disciplineFilter.match('allWorkouts')) this.filterByDiscipline();
  }

  filterWorkouts() {
    if (this.statusFilter.match('allWorkouts') && this.typeFilter.match('allWorkouts')) {
      this.filteredWorkouts = this.workouts;
      return;
    }
    if (this.statusFilter.match('allWorkouts')) {
      // type filter is different than all
      this.filteredWorkouts = this.workouts?.filter(workout => workout.type?.match(this.typeFilter));
    } else if (this.typeFilter.match('allWorkouts')) {
      // type filter is different than all
      this.filteredWorkouts = this.workouts?.filter(workout => workout.status?.match(this.statusFilter));
    } else {
      this.filteredWorkouts = this.workouts
        ?.filter(workout => workout.status?.match(this.statusFilter))
        .filter(workout => workout.type?.match(this.typeFilter));
    }
  }

  disciplineFilterChanged(event: any) {
    this.disciplineFilter = event.target.value.replace(/[0-9]/g, '').replace(': ', '');
    this.filterByDiscipline();
  }

  filterByDiscipline() {
    this.filterWorkouts();
    if (!this.disciplineFilter.match('allWorkouts')) {
      this.filteredWorkouts = this.filteredWorkouts?.filter(workout => workout.sportDiscipline?.name?.match(this.disciplineFilter));
    }
  }
}
