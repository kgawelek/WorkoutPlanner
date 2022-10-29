import { IWorkoutBreakdown, NewWorkoutBreakdown } from './workout-breakdown.model';

export const sampleWithRequiredData: IWorkoutBreakdown = {
  id: 70497,
};

export const sampleWithPartialData: IWorkoutBreakdown = {
  id: 46964,
  duration: 93991,
  notes: 'Function-based red Handcrafted',
};

export const sampleWithFullData: IWorkoutBreakdown = {
  id: 41983,
  distance: 16909,
  duration: 47833,
  distanceUnit: 'Towels Customer',
  notes: 'Metal Avon definition',
  minValue: 27010,
  maxValue: 70965,
  rangeUnit: 'ivory',
};

export const sampleWithNewData: NewWorkoutBreakdown = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
