import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkoutRatingDetailComponent } from '../detail/workout-rating-detail.component';
import { WorkoutRatingUpdateComponent } from '../update/workout-rating-update.component';
import { WorkoutRatingRoutingResolveService } from './workout-rating-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const workoutRatingRoute: Routes = [
  {
    path: ':id/view',
    component: WorkoutRatingDetailComponent,
    resolve: {
      workoutRating: WorkoutRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkoutRatingUpdateComponent,
    resolve: {
      workoutRating: WorkoutRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkoutRatingUpdateComponent,
    resolve: {
      workoutRating: WorkoutRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workoutRatingRoute)],
  exports: [RouterModule],
})
export class WorkoutRatingRoutingModule {}
