import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExerciseTypeComponent } from '../list/exercise-type.component';
import { ExerciseTypeDetailComponent } from '../detail/exercise-type-detail.component';
import { ExerciseTypeUpdateComponent } from '../update/exercise-type-update.component';
import { ExerciseTypeRoutingResolveService } from './exercise-type-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const exerciseTypeRoute: Routes = [
  {
    path: '',
    component: ExerciseTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerciseTypeDetailComponent,
    resolve: {
      exerciseType: ExerciseTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerciseTypeUpdateComponent,
    resolve: {
      exerciseType: ExerciseTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciseTypeUpdateComponent,
    resolve: {
      exerciseType: ExerciseTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exerciseTypeRoute)],
  exports: [RouterModule],
})
export class ExerciseTypeRoutingModule {}
