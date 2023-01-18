import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExerciseUpdateComponent } from './update/exercise-update.component';
import { ExerciseDeleteDialogComponent } from './delete/exercise-delete-dialog.component';
import { ExerciseRoutingModule } from './route/exercise-routing.module';

@NgModule({
  imports: [SharedModule, ExerciseRoutingModule],
  declarations: [ExerciseUpdateComponent, ExerciseDeleteDialogComponent],
})
export class ExerciseModule {}
