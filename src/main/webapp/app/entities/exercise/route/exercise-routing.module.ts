import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExerciseUpdateComponent } from '../update/exercise-update.component';
import { ExerciseRoutingResolveService } from './exercise-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const exerciseRoute: Routes = [
  {
    path: 'new',
    component: ExerciseUpdateComponent,
    resolve: {
      exercise: ExerciseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciseUpdateComponent,
    resolve: {
      exercise: ExerciseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exerciseRoute)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
