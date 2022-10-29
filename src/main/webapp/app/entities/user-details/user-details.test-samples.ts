import { IUserDetails, NewUserDetails } from './user-details.model';

export const sampleWithRequiredData: IUserDetails = {
  id: 22882,
};

export const sampleWithPartialData: IUserDetails = {
  id: 94542,
};

export const sampleWithFullData: IUserDetails = {
  id: 22077,
};

export const sampleWithNewData: NewUserDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
