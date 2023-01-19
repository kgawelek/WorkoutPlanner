import { IWorkoutBreakdown, NewWorkoutBreakdown } from './workout-breakdown.model';

export const sampleWithRequiredData: IWorkoutBreakdown = {
  id: 70497,
};

export const sampleWithPartialData: IWorkoutBreakdown = {
  id: 93991,
  duration: 79237,
  notes: 'throughput',
};

export const sampleWithFullData: IWorkoutBreakdown = {
  id: 2594,
  distance: 59343,
  duration: 10441,
  distanceUnit: 'ADP Mission synergize',
  notes: 'Customer Supervisor Marks',
  minValue: 51495,
  maxValue: 9779,
  rangeUnit: 'definition',
  order: 27010,
};

export const sampleWithNewData: NewWorkoutBreakdown = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
