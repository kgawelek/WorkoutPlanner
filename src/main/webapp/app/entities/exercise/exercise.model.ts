import { IExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { IWorkout } from 'app/entities/workout/workout.model';

export interface IExercise {
  id: number;
  nrOfReps?: number | null;
  nrOfSeries?: number | null;
  weight?: number | null;
  order?: number | null;
  exerciseType?: IExerciseType | null;
  workout?: Pick<IWorkout, 'id'> | null;
}

export type NewExercise = Omit<IExercise, 'id'> & { id: null };
