import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISportDiscipline, NewSportDiscipline } from '../sport-discipline.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISportDiscipline for edit and NewSportDisciplineFormGroupInput for create.
 */
type SportDisciplineFormGroupInput = ISportDiscipline | PartialWithRequiredKeyOf<NewSportDiscipline>;

type SportDisciplineFormDefaults = Pick<NewSportDiscipline, 'id'>;

type SportDisciplineFormGroupContent = {
  id: FormControl<ISportDiscipline['id'] | NewSportDiscipline['id']>;
  name: FormControl<ISportDiscipline['name']>;
};

export type SportDisciplineFormGroup = FormGroup<SportDisciplineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SportDisciplineFormService {
  createSportDisciplineFormGroup(sportDiscipline: SportDisciplineFormGroupInput = { id: null }): SportDisciplineFormGroup {
    const sportDisciplineRawValue = {
      ...this.getFormDefaults(),
      ...sportDiscipline,
    };
    return new FormGroup<SportDisciplineFormGroupContent>({
      id: new FormControl(
        { value: sportDisciplineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(sportDisciplineRawValue.name),
    });
  }

  getSportDiscipline(form: SportDisciplineFormGroup): ISportDiscipline | NewSportDiscipline {
    return form.getRawValue() as ISportDiscipline | NewSportDiscipline;
  }

  resetForm(form: SportDisciplineFormGroup, sportDiscipline: SportDisciplineFormGroupInput): void {
    const sportDisciplineRawValue = { ...this.getFormDefaults(), ...sportDiscipline };
    form.reset(
      {
        ...sportDisciplineRawValue,
        id: { value: sportDisciplineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SportDisciplineFormDefaults {
    return {
      id: null,
    };
  }
}
