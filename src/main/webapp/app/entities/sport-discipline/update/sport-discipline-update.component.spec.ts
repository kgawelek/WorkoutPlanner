import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SportDisciplineFormService } from './sport-discipline-form.service';
import { SportDisciplineService } from '../service/sport-discipline.service';
import { ISportDiscipline } from '../sport-discipline.model';

import { SportDisciplineUpdateComponent } from './sport-discipline-update.component';

describe('SportDiscipline Management Update Component', () => {
  let comp: SportDisciplineUpdateComponent;
  let fixture: ComponentFixture<SportDisciplineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sportDisciplineFormService: SportDisciplineFormService;
  let sportDisciplineService: SportDisciplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SportDisciplineUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SportDisciplineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SportDisciplineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sportDisciplineFormService = TestBed.inject(SportDisciplineFormService);
    sportDisciplineService = TestBed.inject(SportDisciplineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sportDiscipline: ISportDiscipline = { id: 456 };

      activatedRoute.data = of({ sportDiscipline });
      comp.ngOnInit();

      expect(comp.sportDiscipline).toEqual(sportDiscipline);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISportDiscipline>>();
      const sportDiscipline = { id: 123 };
      jest.spyOn(sportDisciplineFormService, 'getSportDiscipline').mockReturnValue(sportDiscipline);
      jest.spyOn(sportDisciplineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sportDiscipline });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sportDiscipline }));
      saveSubject.complete();

      // THEN
      expect(sportDisciplineFormService.getSportDiscipline).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sportDisciplineService.update).toHaveBeenCalledWith(expect.objectContaining(sportDiscipline));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISportDiscipline>>();
      const sportDiscipline = { id: 123 };
      jest.spyOn(sportDisciplineFormService, 'getSportDiscipline').mockReturnValue({ id: null });
      jest.spyOn(sportDisciplineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sportDiscipline: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sportDiscipline }));
      saveSubject.complete();

      // THEN
      expect(sportDisciplineFormService.getSportDiscipline).toHaveBeenCalled();
      expect(sportDisciplineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISportDiscipline>>();
      const sportDiscipline = { id: 123 };
      jest.spyOn(sportDisciplineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sportDiscipline });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sportDisciplineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
