import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserDetailsFormService, UserDetailsFormGroup } from './user-details-form.service';
import { IUserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISportDiscipline } from 'app/entities/sport-discipline/sport-discipline.model';
import { SportDisciplineService } from 'app/entities/sport-discipline/service/sport-discipline.service';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html',
})
export class UserDetailsUpdateComponent implements OnInit {
  isSaving = false;
  userDetails: IUserDetails | null = null;

  usersSharedCollection: IUser[] = [];
  sportDisciplinesSharedCollection: ISportDiscipline[] = [];

  editForm: UserDetailsFormGroup = this.userDetailsFormService.createUserDetailsFormGroup();

  constructor(
    protected userDetailsService: UserDetailsService,
    protected userDetailsFormService: UserDetailsFormService,
    protected userService: UserService,
    protected sportDisciplineService: SportDisciplineService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSportDiscipline = (o1: ISportDiscipline | null, o2: ISportDiscipline | null): boolean =>
    this.sportDisciplineService.compareSportDiscipline(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.userDetails = userDetails;
      if (userDetails) {
        this.updateForm(userDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDetails = this.userDetailsFormService.getUserDetails(this.editForm);
    if (userDetails.id !== null) {
      this.subscribeToSaveResponse(this.userDetailsService.update(userDetails));
    } else {
      this.subscribeToSaveResponse(this.userDetailsService.create(userDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userDetails: IUserDetails): void {
    this.userDetails = userDetails;
    this.userDetailsFormService.resetForm(this.editForm, userDetails);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userDetails.user);
    this.sportDisciplinesSharedCollection = this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(
      this.sportDisciplinesSharedCollection,
      userDetails.sportDiscipline
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userDetails?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.sportDisciplineService
      .query()
      .pipe(map((res: HttpResponse<ISportDiscipline[]>) => res.body ?? []))
      .pipe(
        map((sportDisciplines: ISportDiscipline[]) =>
          this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(
            sportDisciplines,
            this.userDetails?.sportDiscipline
          )
        )
      )
      .subscribe((sportDisciplines: ISportDiscipline[]) => (this.sportDisciplinesSharedCollection = sportDisciplines));
  }
}
