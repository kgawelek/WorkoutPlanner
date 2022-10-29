import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WorkoutRatingFormService } from './workout-rating-form.service';
import { WorkoutRatingService } from '../service/workout-rating.service';
import { IWorkoutRating } from '../workout-rating.model';

import { WorkoutRatingUpdateComponent } from './workout-rating-update.component';

describe('WorkoutRating Management Update Component', () => {
  let comp: WorkoutRatingUpdateComponent;
  let fixture: ComponentFixture<WorkoutRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workoutRatingFormService: WorkoutRatingFormService;
  let workoutRatingService: WorkoutRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WorkoutRatingUpdateComponent],
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
      .overrideTemplate(WorkoutRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workoutRatingFormService = TestBed.inject(WorkoutRatingFormService);
    workoutRatingService = TestBed.inject(WorkoutRatingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const workoutRating: IWorkoutRating = { id: 456 };

      activatedRoute.data = of({ workoutRating });
      comp.ngOnInit();

      expect(comp.workoutRating).toEqual(workoutRating);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkoutRating>>();
      const workoutRating = { id: 123 };
      jest.spyOn(workoutRatingFormService, 'getWorkoutRating').mockReturnValue(workoutRating);
      jest.spyOn(workoutRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workoutRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workoutRating }));
      saveSubject.complete();

      // THEN
      expect(workoutRatingFormService.getWorkoutRating).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(workoutRatingService.update).toHaveBeenCalledWith(expect.objectContaining(workoutRating));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkoutRating>>();
      const workoutRating = { id: 123 };
      jest.spyOn(workoutRatingFormService, 'getWorkoutRating').mockReturnValue({ id: null });
      jest.spyOn(workoutRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workoutRating: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workoutRating }));
      saveSubject.complete();

      // THEN
      expect(workoutRatingFormService.getWorkoutRating).toHaveBeenCalled();
      expect(workoutRatingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkoutRating>>();
      const workoutRating = { id: 123 };
      jest.spyOn(workoutRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workoutRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workoutRatingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
