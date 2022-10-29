import { IExercise, NewExercise } from './exercise.model';

export const sampleWithRequiredData: IExercise = {
  id: 13640,
};

export const sampleWithPartialData: IExercise = {
  id: 40858,
  nrOfReps: 77015,
  nrOfSeries: 6295,
  weight: 36493,
};

export const sampleWithFullData: IExercise = {
  id: 35412,
  nrOfReps: 67398,
  nrOfSeries: 23750,
  weight: 38541,
};

export const sampleWithNewData: NewExercise = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
