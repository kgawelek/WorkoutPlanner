import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sport-discipline',
        data: { pageTitle: 'SportDisciplines' },
        loadChildren: () => import('./sport-discipline/sport-discipline.module').then(m => m.SportDisciplineModule),
      },
      {
        path: 'workout',
        data: { pageTitle: 'Workouts' },
        loadChildren: () => import('./workout/workout.module').then(m => m.WorkoutModule),
      },
      {
        path: 'workout-rating',
        data: { pageTitle: 'WorkoutRatings' },
        loadChildren: () => import('./workout-rating/workout-rating.module').then(m => m.WorkoutRatingModule),
      },
      {
        path: 'exercise-type',
        data: { pageTitle: 'ExerciseTypes' },
        loadChildren: () => import('./exercise-type/exercise-type.module').then(m => m.ExerciseTypeModule),
      },
      {
        path: 'exercise',
        data: { pageTitle: 'Exercises' },
        loadChildren: () => import('./exercise/exercise.module').then(m => m.ExerciseModule),
      },
      {
        path: 'workout-breakdown',
        data: { pageTitle: 'WorkoutBreakdowns' },
        loadChildren: () => import('./workout-breakdown/workout-breakdown.module').then(m => m.WorkoutBreakdownModule),
      },
      {
        path: 'user-details',
        data: { pageTitle: 'UserDetails' },
        loadChildren: () => import('./user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: 'statistics',
        data: { pageTitle: 'Statistics' },
        loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
