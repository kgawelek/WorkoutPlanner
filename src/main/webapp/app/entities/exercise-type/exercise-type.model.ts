export interface IExerciseType {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewExerciseType = Omit<IExerciseType, 'id'> & { id: null };
