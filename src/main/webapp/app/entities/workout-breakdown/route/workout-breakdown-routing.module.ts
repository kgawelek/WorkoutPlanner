import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkoutBreakdownComponent } from '../list/workout-breakdown.component';
import { WorkoutBreakdownDetailComponent } from '../detail/workout-breakdown-detail.component';
import { WorkoutBreakdownUpdateComponent } from '../update/workout-breakdown-update.component';
import { WorkoutBreakdownRoutingResolveService } from './workout-breakdown-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const workoutBreakdownRoute: Routes = [
  {
    path: '',
    component: WorkoutBreakdownComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkoutBreakdownDetailComponent,
    resolve: {
      workoutBreakdown: WorkoutBreakdownRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkoutBreakdownUpdateComponent,
    resolve: {
      workoutBreakdown: WorkoutBreakdownRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkoutBreakdownUpdateComponent,
    resolve: {
      workoutBreakdown: WorkoutBreakdownRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workoutBreakdownRoute)],
  exports: [RouterModule],
})
export class WorkoutBreakdownRoutingModule {}
