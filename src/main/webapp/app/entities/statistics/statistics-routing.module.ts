import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';

const statisticsRoute: Routes = [
  {
    path: '',
    component: StatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(statisticsRoute)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
