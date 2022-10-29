import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkoutRatingComponent } from './list/workout-rating.component';
import { WorkoutRatingDetailComponent } from './detail/workout-rating-detail.component';
import { WorkoutRatingUpdateComponent } from './update/workout-rating-update.component';
import { WorkoutRatingDeleteDialogComponent } from './delete/workout-rating-delete-dialog.component';
import { WorkoutRatingRoutingModule } from './route/workout-rating-routing.module';

@NgModule({
  imports: [SharedModule, WorkoutRatingRoutingModule],
  declarations: [WorkoutRatingComponent, WorkoutRatingDetailComponent, WorkoutRatingUpdateComponent, WorkoutRatingDeleteDialogComponent],
})
export class WorkoutRatingModule {}
