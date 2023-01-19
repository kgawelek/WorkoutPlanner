import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkoutBreakdownUpdateComponent } from '../update/workout-breakdown-update.component';
import { WorkoutBreakdownRoutingResolveService } from './workout-breakdown-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const workoutBreakdownRoute: Routes = [
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
