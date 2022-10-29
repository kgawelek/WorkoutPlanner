import { IUser } from 'app/entities/user/user.model';
import { ISportDiscipline } from 'app/entities/sport-discipline/sport-discipline.model';

export interface IUserDetails {
  id: number;
  user?: Pick<IUser, 'id'> | null;
  sportDiscipline?: Pick<ISportDiscipline, 'id'> | null;
}

export type NewUserDetails = Omit<IUserDetails, 'id'> & { id: null };
