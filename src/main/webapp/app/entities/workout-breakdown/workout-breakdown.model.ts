import { IWorkout } from 'app/entities/workout/workout.model';

export interface IWorkoutBreakdown {
  id: number;
  distance?: number | null;
  duration?: number | null;
  distanceUnit?: string | null;
  notes?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  rangeUnit?: string | null;
  order?: number | null;
  workout?: Pick<IWorkout, 'id'> | null;
}

export type NewWorkoutBreakdown = Omit<IWorkoutBreakdown, 'id'> & { id: null };
