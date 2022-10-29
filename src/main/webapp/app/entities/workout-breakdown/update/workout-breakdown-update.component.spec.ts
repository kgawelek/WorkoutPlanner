import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WorkoutBreakdownFormService } from './workout-breakdown-form.service';
import { WorkoutBreakdownService } from '../service/workout-breakdown.service';
import { IWorkoutBreakdown } from '../workout-breakdown.model';
import { IWorkout } from 'app/entities/workout/workout.model';
import { WorkoutService } from 'app/entities/workout/service/workout.service';

import { WorkoutBreakdownUpdateComponent } from './workout-breakdown-update.component';

describe('WorkoutBreakdown Management Update Component', () => {
  let comp: WorkoutBreakdownUpdateComponent;
  let fixture: ComponentFixture<WorkoutBreakdownUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workoutBreakdownFormService: WorkoutBreakdownFormService;
  let workoutBreakdownService: WorkoutBreakdownService;
  let workoutService: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WorkoutBreakdownUpdateComponent],
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
      .overrideTemplate(WorkoutBreakdownUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutBreakdownUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workoutBreakdownFormService = TestBed.inject(WorkoutBreakdownFormService);
    workoutBreakdownService = TestBed.inject(WorkoutBreakdownService);
    workoutService = TestBed.inject(WorkoutService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Workout query and add missing value', () => {
      const workoutBreakdown: IWorkoutBreakdown = { id: 456 };
      const workout: IWorkout = { id: 37149 };
      workoutBreakdown.workout = workout;

      const workoutCollection: IWorkout[] = [{ id: 47348 }];
      jest.spyOn(workoutService, 'query').mockReturnValue(of(new HttpResponse({ body: workoutCollection })));
      const additionalWorkouts = [workout];
      const expectedCollection: IWorkout[] = [...additionalWorkouts, ...workoutCollection];
      jest.spyOn(workoutService, 'addWorkoutToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ workoutBreakdown });
      comp.ngOnInit();

      expect(workoutService.query).toHaveBeenCalled();
      expect(workoutService.addWorkoutToCollectionIfMissing).toHaveBeenCalledWith(
        workoutCollection,
        ...additionalWorkouts.map(expect.objectContaining)
      );
      expect(comp.workoutsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const workoutBreakdown: IWorkoutBreakdown = { id: 456 };
      const workout: IWorkout = { id: 94794 };
      workoutBreakdown.workout = workout;

      activatedRoute.data = of({ workoutBreakdown });
      comp.ngOnInit();

      expect(comp.workoutsSharedCollection).toContain(workout);
      expect(comp.workoutBreakdown).toEqual(workoutBreakdown);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkoutBreakdown>>();
      const workoutBreakdown = { id: 123 };
      jest.spyOn(workoutBreakdownFormService, 'getWorkoutBreakdown').mockReturnValue(workoutBreakdown);
      jest.spyOn(workoutBreakdownService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workoutBreakdown });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workoutBreakdown }));
      saveSubject.complete();

      // THEN
      expect(workoutBreakdownFormService.getWorkoutBreakdown).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(workoutBreakdownService.update).toHaveBeenCalledWith(expect.objectContaining(workoutBreakdown));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkoutBreakdown>>();
      const workoutBreakdown = { id: 123 };
      jest.spyOn(workoutBreakdownFormService, 'getWorkoutBreakdown').mockReturnValue({ id: null });
      jest.spyOn(workoutBreakdownService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workoutBreakdown: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workoutBreakdown }));
      saveSubject.complete();

      // THEN
      expect(workoutBreakdownFormService.getWorkoutBreakdown).toHaveBeenCalled();
      expect(workoutBreakdownService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkoutBreakdown>>();
      const workoutBreakdown = { id: 123 };
      jest.spyOn(workoutBreakdownService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workoutBreakdown });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workoutBreakdownService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareWorkout', () => {
      it('Should forward to workoutService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(workoutService, 'compareWorkout');
        comp.compareWorkout(entity, entity2);
        expect(workoutService.compareWorkout).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
