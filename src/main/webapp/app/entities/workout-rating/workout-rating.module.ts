import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkoutRatingDetailComponent } from './detail/workout-rating-detail.component';
import { WorkoutRatingUpdateComponent } from './update/workout-rating-update.component';
import { WorkoutRatingRoutingModule } from './route/workout-rating-routing.module';

@NgModule({
  imports: [SharedModule, WorkoutRatingRoutingModule],
  declarations: [WorkoutRatingDetailComponent, WorkoutRatingUpdateComponent],
})
export class WorkoutRatingModule {}
