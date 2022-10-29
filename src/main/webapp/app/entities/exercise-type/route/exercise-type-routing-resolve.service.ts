import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExerciseType } from '../exercise-type.model';
import { ExerciseTypeService } from '../service/exercise-type.service';

@Injectable({ providedIn: 'root' })
export class ExerciseTypeRoutingResolveService implements Resolve<IExerciseType | null> {
  constructor(protected service: ExerciseTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExerciseType | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exerciseType: HttpResponse<IExerciseType>) => {
          if (exerciseType.body) {
            return of(exerciseType.body);
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
