import { IExercise, NewExercise } from './exercise.model';

export const sampleWithRequiredData: IExercise = {
  id: 13640,
};

export const sampleWithPartialData: IExercise = {
  id: 77015,
  nrOfReps: 6295,
  nrOfSeries: 36493,
  weight: 35412,
};

export const sampleWithFullData: IExercise = {
  id: 67398,
  nrOfReps: 23750,
  nrOfSeries: 38541,
  weight: 30946,
  order: 91635,
};

export const sampleWithNewData: NewExercise = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
