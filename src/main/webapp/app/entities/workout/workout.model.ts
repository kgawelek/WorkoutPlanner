import dayjs from 'dayjs/esm';
import { IWorkoutRating } from 'app/entities/workout-rating/workout-rating.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { Status } from 'app/entities/enumerations/status.model';
import { WorkoutType } from 'app/entities/enumerations/workout-type.model';

export interface IWorkout {
  id: number;
  date?: dayjs.Dayjs | null;
  duration?: string | null;
  comment?: string | null;
  status?: Status | null;
  type?: WorkoutType | null;
  workoutRating?: Pick<IWorkoutRating, 'id'> | null;
  userDetails?: Pick<IUserDetails, 'id'> | null;
}

export type NewWorkout = Omit<IWorkout, 'id'> & { id: null };
