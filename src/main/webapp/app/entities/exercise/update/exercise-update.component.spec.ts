import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerciseFormService } from './exercise-form.service';
import { ExerciseService } from '../service/exercise.service';
import { IExercise } from '../exercise.model';
import { IExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { ExerciseTypeService } from 'app/entities/exercise-type/service/exercise-type.service';
import { IWorkout } from 'app/entities/workout/workout.model';
import { WorkoutService } from 'app/entities/workout/service/workout.service';

import { ExerciseUpdateComponent } from './exercise-update.component';

describe('Exercise Management Update Component', () => {
  let comp: ExerciseUpdateComponent;
  let fixture: ComponentFixture<ExerciseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerciseFormService: ExerciseFormService;
  let exerciseService: ExerciseService;
  let exerciseTypeService: ExerciseTypeService;
  let workoutService: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExerciseUpdateComponent],
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
      .overrideTemplate(ExerciseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerciseFormService = TestBed.inject(ExerciseFormService);
    exerciseService = TestBed.inject(ExerciseService);
    exerciseTypeService = TestBed.inject(ExerciseTypeService);
    workoutService = TestBed.inject(WorkoutService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ExerciseType query and add missing value', () => {
      const exercise: IExercise = { id: 456 };
      const exerciseType: IExerciseType = { id: 19736 };
      exercise.exerciseType = exerciseType;

      const exerciseTypeCollection: IExerciseType[] = [{ id: 52546 }];
      jest.spyOn(exerciseTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: exerciseTypeCollection })));
      const additionalExerciseTypes = [exerciseType];
      const expectedCollection: IExerciseType[] = [...additionalExerciseTypes, ...exerciseTypeCollection];
      jest.spyOn(exerciseTypeService, 'addExerciseTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      expect(exerciseTypeService.query).toHaveBeenCalled();
      expect(exerciseTypeService.addExerciseTypeToCollectionIfMissing).toHaveBeenCalledWith(
        exerciseTypeCollection,
        ...additionalExerciseTypes.map(expect.objectContaining)
      );
      expect(comp.exerciseTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Workout query and add missing value', () => {
      const exercise: IExercise = { id: 456 };
      const workout: IWorkout = { id: 82369 };
      exercise.workout = workout;

      const workoutCollection: IWorkout[] = [{ id: 88878 }];
      jest.spyOn(workoutService, 'query').mockReturnValue(of(new HttpResponse({ body: workoutCollection })));
      const additionalWorkouts = [workout];
      const expectedCollection: IWorkout[] = [...additionalWorkouts, ...workoutCollection];
      jest.spyOn(workoutService, 'addWorkoutToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      expect(workoutService.query).toHaveBeenCalled();
      expect(workoutService.addWorkoutToCollectionIfMissing).toHaveBeenCalledWith(
        workoutCollection,
        ...additionalWorkouts.map(expect.objectContaining)
      );
      expect(comp.workoutsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const exercise: IExercise = { id: 456 };
      const exerciseType: IExerciseType = { id: 48960 };
      exercise.exerciseType = exerciseType;
      const workout: IWorkout = { id: 93086 };
      exercise.workout = workout;

      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      expect(comp.exerciseTypesSharedCollection).toContain(exerciseType);
      expect(comp.workoutsSharedCollection).toContain(workout);
      expect(comp.exercise).toEqual(exercise);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExercise>>();
      const exercise = { id: 123 };
      jest.spyOn(exerciseFormService, 'getExercise').mockReturnValue(exercise);
      jest.spyOn(exerciseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exercise }));
      saveSubject.complete();

      // THEN
      expect(exerciseFormService.getExercise).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerciseService.update).toHaveBeenCalledWith(expect.objectContaining(exercise));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExercise>>();
      const exercise = { id: 123 };
      jest.spyOn(exerciseFormService, 'getExercise').mockReturnValue({ id: null });
      jest.spyOn(exerciseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercise: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exercise }));
      saveSubject.complete();

      // THEN
      expect(exerciseFormService.getExercise).toHaveBeenCalled();
      expect(exerciseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExercise>>();
      const exercise = { id: 123 };
      jest.spyOn(exerciseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerciseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareExerciseType', () => {
      it('Should forward to exerciseTypeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(exerciseTypeService, 'compareExerciseType');
        comp.compareExerciseType(entity, entity2);
        expect(exerciseTypeService.compareExerciseType).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
