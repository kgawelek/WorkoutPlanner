import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sport-discipline.test-samples';

import { SportDisciplineFormService } from './sport-discipline-form.service';

describe('SportDiscipline Form Service', () => {
  let service: SportDisciplineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportDisciplineFormService);
  });

  describe('Service methods', () => {
    describe('createSportDisciplineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSportDisciplineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing ISportDiscipline should create a new form with FormGroup', () => {
        const formGroup = service.createSportDisciplineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getSportDiscipline', () => {
      it('should return NewSportDiscipline for default SportDiscipline initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSportDisciplineFormGroup(sampleWithNewData);

        const sportDiscipline = service.getSportDiscipline(formGroup) as any;

        expect(sportDiscipline).toMatchObject(sampleWithNewData);
      });

      it('should return NewSportDiscipline for empty SportDiscipline initial value', () => {
        const formGroup = service.createSportDisciplineFormGroup();

        const sportDiscipline = service.getSportDiscipline(formGroup) as any;

        expect(sportDiscipline).toMatchObject({});
      });

      it('should return ISportDiscipline', () => {
        const formGroup = service.createSportDisciplineFormGroup(sampleWithRequiredData);

        const sportDiscipline = service.getSportDiscipline(formGroup) as any;

        expect(sportDiscipline).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISportDiscipline should not enable id FormControl', () => {
        const formGroup = service.createSportDisciplineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSportDiscipline should disable id FormControl', () => {
        const formGroup = service.createSportDisciplineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
