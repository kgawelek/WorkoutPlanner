import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkoutBreakdown, NewWorkoutBreakdown } from '../workout-breakdown.model';

export type PartialUpdateWorkoutBreakdown = Partial<IWorkoutBreakdown> & Pick<IWorkoutBreakdown, 'id'>;

export type EntityResponseType = HttpResponse<IWorkoutBreakdown>;
export type EntityArrayResponseType = HttpResponse<IWorkoutBreakdown[]>;

@Injectable({ providedIn: 'root' })
export class WorkoutBreakdownService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/workout-breakdowns');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(workoutBreakdown: NewWorkoutBreakdown): Observable<EntityResponseType> {
    return this.http.post<IWorkoutBreakdown>(this.resourceUrl, workoutBreakdown, { observe: 'response' });
  }

  update(workoutBreakdown: IWorkoutBreakdown): Observable<EntityResponseType> {
    return this.http.put<IWorkoutBreakdown>(
      `${this.resourceUrl}/${this.getWorkoutBreakdownIdentifier(workoutBreakdown)}`,
      workoutBreakdown,
      { observe: 'response' }
    );
  }

  partialUpdate(workoutBreakdown: PartialUpdateWorkoutBreakdown): Observable<EntityResponseType> {
    return this.http.patch<IWorkoutBreakdown>(
      `${this.resourceUrl}/${this.getWorkoutBreakdownIdentifier(workoutBreakdown)}`,
      workoutBreakdown,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkoutBreakdown>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkoutBreakdown[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWorkoutBreakdownIdentifier(workoutBreakdown: Pick<IWorkoutBreakdown, 'id'>): number {
    return workoutBreakdown.id;
  }

  compareWorkoutBreakdown(o1: Pick<IWorkoutBreakdown, 'id'> | null, o2: Pick<IWorkoutBreakdown, 'id'> | null): boolean {
    return o1 && o2 ? this.getWorkoutBreakdownIdentifier(o1) === this.getWorkoutBreakdownIdentifier(o2) : o1 === o2;
  }

  addWorkoutBreakdownToCollectionIfMissing<Type extends Pick<IWorkoutBreakdown, 'id'>>(
    workoutBreakdownCollection: Type[],
    ...workoutBreakdownsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const workoutBreakdowns: Type[] = workoutBreakdownsToCheck.filter(isPresent);
    if (workoutBreakdowns.length > 0) {
      const workoutBreakdownCollectionIdentifiers = workoutBreakdownCollection.map(
        workoutBreakdownItem => this.getWorkoutBreakdownIdentifier(workoutBreakdownItem)!
      );
      const workoutBreakdownsToAdd = workoutBreakdowns.filter(workoutBreakdownItem => {
        const workoutBreakdownIdentifier = this.getWorkoutBreakdownIdentifier(workoutBreakdownItem);
        if (workoutBreakdownCollectionIdentifiers.includes(workoutBreakdownIdentifier)) {
          return false;
        }
        workoutBreakdownCollectionIdentifiers.push(workoutBreakdownIdentifier);
        return true;
      });
      return [...workoutBreakdownsToAdd, ...workoutBreakdownCollection];
    }
    return workoutBreakdownCollection;
  }
}
