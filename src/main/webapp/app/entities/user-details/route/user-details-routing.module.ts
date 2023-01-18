import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserDetailsUpdateComponent } from '../update/user-details-update.component';
import { UserDetailsRoutingResolveService } from './user-details-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userDetailsRoute: Routes = [
  {
    path: ':id/edit',
    component: UserDetailsUpdateComponent,
    resolve: {
      userDetails: UserDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userDetailsRoute)],
  exports: [RouterModule],
})
export class UserDetailsRoutingModule {}
