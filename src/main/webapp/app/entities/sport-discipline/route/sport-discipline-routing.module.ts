import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SportDisciplineComponent } from '../list/sport-discipline.component';
import { SportDisciplineDetailComponent } from '../detail/sport-discipline-detail.component';
import { SportDisciplineUpdateComponent } from '../update/sport-discipline-update.component';
import { SportDisciplineRoutingResolveService } from './sport-discipline-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sportDisciplineRoute: Routes = [
  {
    path: '',
    component: SportDisciplineComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SportDisciplineDetailComponent,
    resolve: {
      sportDiscipline: SportDisciplineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SportDisciplineUpdateComponent,
    resolve: {
      sportDiscipline: SportDisciplineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SportDisciplineUpdateComponent,
    resolve: {
      sportDiscipline: SportDisciplineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sportDisciplineRoute)],
  exports: [RouterModule],
})
export class SportDisciplineRoutingModule {}
