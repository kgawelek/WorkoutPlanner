import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';

@Injectable({ providedIn: 'root' })
export class UserDetailsRoutingResolveService implements Resolve<IUserDetails | null> {
  constructor(protected service: UserDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userDetails: HttpResponse<IUserDetails>) => {
          if (userDetails.body) {
            return of(userDetails.body);
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
