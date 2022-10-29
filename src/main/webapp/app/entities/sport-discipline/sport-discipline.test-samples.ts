import { ISportDiscipline, NewSportDiscipline } from './sport-discipline.model';

export const sampleWithRequiredData: ISportDiscipline = {
  id: 36412,
};

export const sampleWithPartialData: ISportDiscipline = {
  id: 22337,
  name: 'user-centric connect Tasty',
};

export const sampleWithFullData: ISportDiscipline = {
  id: 30814,
  name: 'Account Personal Gorgeous',
};

export const sampleWithNewData: NewSportDiscipline = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
