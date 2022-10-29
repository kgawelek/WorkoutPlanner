import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserDetails, NewUserDetails } from '../user-details.model';

export type PartialUpdateUserDetails = Partial<IUserDetails> & Pick<IUserDetails, 'id'>;

export type EntityResponseType = HttpResponse<IUserDetails>;
export type EntityArrayResponseType = HttpResponse<IUserDetails[]>;

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userDetails: NewUserDetails): Observable<EntityResponseType> {
    return this.http.post<IUserDetails>(this.resourceUrl, userDetails, { observe: 'response' });
  }

  update(userDetails: IUserDetails): Observable<EntityResponseType> {
    return this.http.put<IUserDetails>(`${this.resourceUrl}/${this.getUserDetailsIdentifier(userDetails)}`, userDetails, {
      observe: 'response',
    });
  }

  partialUpdate(userDetails: PartialUpdateUserDetails): Observable<EntityResponseType> {
    return this.http.patch<IUserDetails>(`${this.resourceUrl}/${this.getUserDetailsIdentifier(userDetails)}`, userDetails, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserDetailsIdentifier(userDetails: Pick<IUserDetails, 'id'>): number {
    return userDetails.id;
  }

  compareUserDetails(o1: Pick<IUserDetails, 'id'> | null, o2: Pick<IUserDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserDetailsIdentifier(o1) === this.getUserDetailsIdentifier(o2) : o1 === o2;
  }

  addUserDetailsToCollectionIfMissing<Type extends Pick<IUserDetails, 'id'>>(
    userDetailsCollection: Type[],
    ...userDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userDetails: Type[] = userDetailsToCheck.filter(isPresent);
    if (userDetails.length > 0) {
      const userDetailsCollectionIdentifiers = userDetailsCollection.map(
        userDetailsItem => this.getUserDetailsIdentifier(userDetailsItem)!
      );
      const userDetailsToAdd = userDetails.filter(userDetailsItem => {
        const userDetailsIdentifier = this.getUserDetailsIdentifier(userDetailsItem);
        if (userDetailsCollectionIdentifiers.includes(userDetailsIdentifier)) {
          return false;
        }
        userDetailsCollectionIdentifiers.push(userDetailsIdentifier);
        return true;
      });
      return [...userDetailsToAdd, ...userDetailsCollection];
    }
    return userDetailsCollection;
  }
}
