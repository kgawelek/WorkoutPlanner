import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SportDisciplineComponent } from './list/sport-discipline.component';
import { SportDisciplineDetailComponent } from './detail/sport-discipline-detail.component';
import { SportDisciplineUpdateComponent } from './update/sport-discipline-update.component';
import { SportDisciplineDeleteDialogComponent } from './delete/sport-discipline-delete-dialog.component';
import { SportDisciplineRoutingModule } from './route/sport-discipline-routing.module';

@NgModule({
  imports: [SharedModule, SportDisciplineRoutingModule],
  declarations: [
    SportDisciplineComponent,
    SportDisciplineDetailComponent,
    SportDisciplineUpdateComponent,
    SportDisciplineDeleteDialogComponent,
  ],
})
export class SportDisciplineModule {}
