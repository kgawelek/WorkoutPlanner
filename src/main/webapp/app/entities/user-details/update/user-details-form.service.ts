import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserDetails, NewUserDetails } from '../user-details.model';

type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserDetails for edit and NewUserDetailsFormGroupInput for create.
 */
type UserDetailsFormGroupInput = IUserDetails | PartialWithRequiredKeyOf<NewUserDetails>;

type UserDetailsFormDefaults = Pick<NewUserDetails, 'id'>;

type UserDetailsFormGroupContent = {
  id: FormControl<IUserDetails['id'] | NewUserDetails['id']>;
  user: FormControl<IUserDetails['user']>;
  sportDiscipline: FormControl<IUserDetails['sportDiscipline']>;
};

export type UserDetailsFormGroup = FormGroup<UserDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserDetailsFormService {
  createUserDetailsFormGroup(userDetails: UserDetailsFormGroupInput = { id: null }): UserDetailsFormGroup {
    const userDetailsRawValue = {
      ...this.getFormDefaults(),
      ...userDetails,
    };
    return new FormGroup<UserDetailsFormGroupContent>({
      id: new FormControl(
        { value: userDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user: new FormControl(userDetailsRawValue.user),
      sportDiscipline: new FormControl(userDetailsRawValue.sportDiscipline),
    });
  }

  getUserDetails(form: UserDetailsFormGroup): IUserDetails | NewUserDetails {
    return form.getRawValue() as IUserDetails | NewUserDetails;
  }

  resetForm(form: UserDetailsFormGroup, userDetails: UserDetailsFormGroupInput): void {
    const userDetailsRawValue = { ...this.getFormDefaults(), ...userDetails };
    form.reset(
      {
        ...userDetailsRawValue,
        id: { value: userDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserDetailsFormDefaults {
    return {
      id: null,
    };
  }
}
