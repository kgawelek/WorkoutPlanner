import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorkoutRating } from '../workout-rating.model';
import { WorkoutRatingService } from '../service/workout-rating.service';

@Injectable({ providedIn: 'root' })
export class WorkoutRatingRoutingResolveService implements Resolve<IWorkoutRating | null> {
  constructor(protected service: WorkoutRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkoutRating | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((workoutRating: HttpResponse<IWorkoutRating>) => {
          if (workoutRating.body) {
            return of(workoutRating.body);
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
