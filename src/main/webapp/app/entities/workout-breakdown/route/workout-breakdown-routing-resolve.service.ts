import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorkoutBreakdown } from '../workout-breakdown.model';
import { WorkoutBreakdownService } from '../service/workout-breakdown.service';

@Injectable({ providedIn: 'root' })
export class WorkoutBreakdownRoutingResolveService implements Resolve<IWorkoutBreakdown | null> {
  constructor(protected service: WorkoutBreakdownService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkoutBreakdown | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((workoutBreakdown: HttpResponse<IWorkoutBreakdown>) => {
          if (workoutBreakdown.body) {
            return of(workoutBreakdown.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
