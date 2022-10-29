import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExerciseTypeComponent } from './list/exercise-type.component';
import { ExerciseTypeDetailComponent } from './detail/exercise-type-detail.component';
import { ExerciseTypeUpdateComponent } from './update/exercise-type-update.component';
import { ExerciseTypeDeleteDialogComponent } from './delete/exercise-type-delete-dialog.component';
import { ExerciseTypeRoutingModule } from './route/exercise-type-routing.module';

@NgModule({
  imports: [SharedModule, ExerciseTypeRoutingModule],
  declarations: [ExerciseTypeComponent, ExerciseTypeDetailComponent, ExerciseTypeUpdateComponent, ExerciseTypeDeleteDialogComponent],
})
export class ExerciseTypeModule {}
