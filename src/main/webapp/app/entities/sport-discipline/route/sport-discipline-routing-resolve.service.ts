import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISportDiscipline } from '../sport-discipline.model';
import { SportDisciplineService } from '../service/sport-discipline.service';

@Injectable({ providedIn: 'root' })
export class SportDisciplineRoutingResolveService implements Resolve<ISportDiscipline | null> {
  constructor(protected service: SportDisciplineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISportDiscipline | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sportDiscipline: HttpResponse<ISportDiscipline>) => {
          if (sportDiscipline.body) {
            return of(sportDiscipline.body);
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
