import { RatingScale } from 'app/entities/enumerations/rating-scale.model';

import { IWorkoutRating, NewWorkoutRating } from './workout-rating.model';

export const sampleWithRequiredData: IWorkoutRating = {
  id: 63464,
};

export const sampleWithPartialData: IWorkoutRating = {
  id: 19814,
  rate: RatingScale['MODERATE'],
};

export const sampleWithFullData: IWorkoutRating = {
  id: 80045,
  comment: 'i',
  rate: RatingScale['KILLER'],
};

export const sampleWithNewData: NewWorkoutRating = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
