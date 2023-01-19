import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkoutBreakdownUpdateComponent } from './update/workout-breakdown-update.component';
import { WorkoutBreakdownDeleteDialogComponent } from './delete/workout-breakdown-delete-dialog.component';
import { WorkoutBreakdownRoutingModule } from './route/workout-breakdown-routing.module';

@NgModule({
  imports: [SharedModule, WorkoutBreakdownRoutingModule],
  declarations: [WorkoutBreakdownUpdateComponent, WorkoutBreakdownDeleteDialogComponent],
})
export class WorkoutBreakdownModule {}
