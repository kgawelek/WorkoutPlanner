import { RatingScale } from 'app/entities/enumerations/rating-scale.model';
import { IWorkout } from '../workout/workout.model';

export interface IWorkoutRating {
  id: number;
  comment?: string | null;
  rate?: RatingScale | null;
  workout?: IWorkout | null;
}

export type NewWorkoutRating = Omit<IWorkoutRating, 'id'> & { id: null };
