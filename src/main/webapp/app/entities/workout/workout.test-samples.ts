import dayjs from 'dayjs/esm';

import { Status } from 'app/entities/enumerations/status.model';
import { WorkoutType } from 'app/entities/enumerations/workout-type.model';

import { IWorkout, NewWorkout } from './workout.model';

export const sampleWithRequiredData: IWorkout = {
  id: 88410,
};

export const sampleWithPartialData: IWorkout = {
  id: 23027,
  date: dayjs('2022-10-29T01:49'),
  duration: '85231',
  comment: 'Grass-roots Tasty',
};

export const sampleWithFullData: IWorkout = {
  id: 60366,
  date: dayjs('2022-10-29T03:28'),
  duration: '74104',
  comment: 'Botswana Brook',
  status: Status['ABANDONED'],
  type: WorkoutType['INTERVAL'],
};

export const sampleWithNewData: NewWorkout = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
