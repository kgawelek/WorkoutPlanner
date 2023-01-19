import dayjs from 'dayjs/esm';
import { IWorkoutRating } from 'app/entities/workout-rating/workout-rating.model';
import { ISportDiscipline } from 'app/entities/sport-discipline/sport-discipline.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { Status } from 'app/entities/enumerations/status.model';
import { WorkoutType } from 'app/entities/enumerations/workout-type.model';
import { IExercise } from '../exercise/exercise.model';
import { IWorkoutBreakdown } from '../workout-breakdown/workout-breakdown.model';

export interface IWorkout {
  id: number;
  date?: dayjs.Dayjs | null;
  duration?: string | null;
  comment?: string | null;
  status?: Status | null;
  type?: WorkoutType | null;
  workoutRating?: IWorkoutRating | null;
  sportDiscipline?: ISportDiscipline | null;
  userDetails?: Pick<IUserDetails, 'id'> | null;
  exercises?: Set<IExercise> | null;
  workoutBreakdowns?: Set<IWorkoutBreakdown> | null;
}

export type NewWorkout = Omit<IWorkout, 'id'> & { id: null };
