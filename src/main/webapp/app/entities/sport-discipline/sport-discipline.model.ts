export interface ISportDiscipline {
  id: number;
  name?: string | null;
}

export type NewSportDiscipline = Omit<ISportDiscipline, 'id'> & { id: null };
