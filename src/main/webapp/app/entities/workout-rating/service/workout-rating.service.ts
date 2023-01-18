import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkoutRating, NewWorkoutRating } from '../workout-rating.model';

export type PartialUpdateWorkoutRating = Partial<IWorkoutRating> & Pick<IWorkoutRating, 'id'>;

export type EntityResponseType = HttpResponse<IWorkoutRating>;
export type EntityArrayResponseType = HttpResponse<IWorkoutRating[]>;

@Injectable({ providedIn: 'root' })
export class WorkoutRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/workout-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(workoutRating: NewWorkoutRating): Observable<EntityResponseType> {
    return this.http.post<IWorkoutRating>(this.resourceUrl, workoutRating, { observe: 'response' });
  }

  update(workoutRating: IWorkoutRating): Observable<EntityResponseType> {
    return this.http.put<IWorkoutRating>(`${this.resourceUrl}/${this.getWorkoutRatingIdentifier(workoutRating)}`, workoutRating, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkoutRating>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkoutRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWorkoutRatingIdentifier(workoutRating: Pick<IWorkoutRating, 'id'>): number {
    return workoutRating.id;
  }

  compareWorkoutRating(o1: Pick<IWorkoutRating, 'id'> | null, o2: Pick<IWorkoutRating, 'id'> | null): boolean {
    return o1 && o2 ? this.getWorkoutRatingIdentifier(o1) === this.getWorkoutRatingIdentifier(o2) : o1 === o2;
  }

  addWorkoutRatingToCollectionIfMissing<Type extends Pick<IWorkoutRating, 'id'>>(
    workoutRatingCollection: Type[],
    ...workoutRatingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const workoutRatings: Type[] = workoutRatingsToCheck.filter(isPresent);
    if (workoutRatings.length > 0) {
      const workoutRatingCollectionIdentifiers = workoutRatingCollection.map(
        workoutRatingItem => this.getWorkoutRatingIdentifier(workoutRatingItem)!
      );
      const workoutRatingsToAdd = workoutRatings.filter(workoutRatingItem => {
        const workoutRatingIdentifier = this.getWorkoutRatingIdentifier(workoutRatingItem);
        if (workoutRatingCollectionIdentifiers.includes(workoutRatingIdentifier)) {
          return false;
        }
        workoutRatingCollectionIdentifiers.push(workoutRatingIdentifier);
        return true;
      });
      return [...workoutRatingsToAdd, ...workoutRatingCollection];
    }
    return workoutRatingCollection;
  }
}
