import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISportDiscipline, NewSportDiscipline } from '../sport-discipline.model';

export type PartialUpdateSportDiscipline = Partial<ISportDiscipline> & Pick<ISportDiscipline, 'id'>;

export type EntityResponseType = HttpResponse<ISportDiscipline>;
export type EntityArrayResponseType = HttpResponse<ISportDiscipline[]>;

@Injectable({ providedIn: 'root' })
export class SportDisciplineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sport-disciplines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sportDiscipline: NewSportDiscipline): Observable<EntityResponseType> {
    return this.http.post<ISportDiscipline>(this.resourceUrl, sportDiscipline, { observe: 'response' });
  }

  update(sportDiscipline: ISportDiscipline): Observable<EntityResponseType> {
    return this.http.put<ISportDiscipline>(`${this.resourceUrl}/${this.getSportDisciplineIdentifier(sportDiscipline)}`, sportDiscipline, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISportDiscipline>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISportDiscipline[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSportDisciplineIdentifier(sportDiscipline: Pick<ISportDiscipline, 'id'>): number {
    return sportDiscipline.id;
  }

  compareSportDiscipline(o1: Pick<ISportDiscipline, 'id'> | null, o2: Pick<ISportDiscipline, 'id'> | null): boolean {
    return o1 && o2 ? this.getSportDisciplineIdentifier(o1) === this.getSportDisciplineIdentifier(o2) : o1 === o2;
  }

  addSportDisciplineToCollectionIfMissing<Type extends Pick<ISportDiscipline, 'id'>>(
    sportDisciplineCollection: Type[],
    ...sportDisciplinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sportDisciplines: Type[] = sportDisciplinesToCheck.filter(isPresent);
    if (sportDisciplines.length > 0) {
      const sportDisciplineCollectionIdentifiers = sportDisciplineCollection.map(
        sportDisciplineItem => this.getSportDisciplineIdentifier(sportDisciplineItem)!
      );
      const sportDisciplinesToAdd = sportDisciplines.filter(sportDisciplineItem => {
        const sportDisciplineIdentifier = this.getSportDisciplineIdentifier(sportDisciplineItem);
        if (sportDisciplineCollectionIdentifiers.includes(sportDisciplineIdentifier)) {
          return false;
        }
        sportDisciplineCollectionIdentifiers.push(sportDisciplineIdentifier);
        return true;
      });
      return [...sportDisciplinesToAdd, ...sportDisciplineCollection];
    }
    return sportDisciplineCollection;
  }
}
