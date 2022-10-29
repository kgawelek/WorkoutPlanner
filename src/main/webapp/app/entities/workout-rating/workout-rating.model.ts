import { RatingScale } from 'app/entities/enumerations/rating-scale.model';

export interface IWorkoutRating {
  id: number;
  comment?: string | null;
  rate?: RatingScale | null;
}

export type NewWorkoutRating = Omit<IWorkoutRating, 'id'> & { id: null };
