import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ISportDiscipline } from '../../entities/sport-discipline/sport-discipline.model';
import { SportDisciplineService } from '../../entities/sport-discipline/service/sport-discipline.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { UserDetailsService } from '../../entities/user-details/service/user-details.service';

const initialAccount: Account = {} as Account;

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  success = false;
  sportDisciplinesSharedCollection: ISportDiscipline[] = [];
  selectedSportDiscipline: ISportDiscipline | null = null;

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  constructor(
    private accountService: AccountService,
    protected sportDisciplineService: SportDisciplineService,
    protected userDetailsService: UserDetailsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });

    this.sportDisciplineService
      .query()
      .pipe(map((res: HttpResponse<ISportDiscipline[]>) => res.body ?? []))
      .pipe(
        map((sportDisciplines: ISportDiscipline[]) =>
          this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(sportDisciplines)
        )
      )
      .subscribe((sportDisciplines: ISportDiscipline[]) => (this.sportDisciplinesSharedCollection = sportDisciplines));
    this.sportDisciplinesSharedCollection = this.sportDisciplineService.addSportDisciplineToCollectionIfMissing<ISportDiscipline>(
      this.sportDisciplinesSharedCollection
    );

    this.http.get('api/user-details/sport-discipline').subscribe(
      // @ts-ignore
      (data: ISportDiscipline) => (this.selectedSportDiscipline = data)
    );
  }

  save(): void {
    this.success = false;
    this.http
      .post('api/user-details/sport-discipline', { id: this.selectedSportDiscipline?.id, name: this.selectedSportDiscipline?.name })
      .subscribe();

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(account);
    });
  }
}
