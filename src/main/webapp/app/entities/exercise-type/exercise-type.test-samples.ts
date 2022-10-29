import { IExerciseType, NewExerciseType } from './exercise-type.model';

export const sampleWithRequiredData: IExerciseType = {
  id: 38809,
};

export const sampleWithPartialData: IExerciseType = {
  id: 41214,
};

export const sampleWithFullData: IExerciseType = {
  id: 70635,
  name: 'virtual',
  description: 'Borders holistic Front-line',
};

export const sampleWithNewData: NewExerciseType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
