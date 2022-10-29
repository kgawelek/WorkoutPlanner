import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WorkoutFormService } from './workout-form.service';
import { WorkoutService } from '../service/workout.service';
import { IWorkout } from '../workout.model';
import { IWorkoutRating } from 'app/entities/workout-rating/workout-rating.model';
import { WorkoutRatingService } from 'app/entities/workout-rating/service/workout-rating.service';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';

import { WorkoutUpdateComponent } from './workout-update.component';

describe('Workout Management Update Component', () => {
  let comp: WorkoutUpdateComponent;
  let fixture: ComponentFixture<WorkoutUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workoutFormService: WorkoutFormService;
  let workoutService: WorkoutService;
  let workoutRatingService: WorkoutRatingService;
  let userDetailsService: UserDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WorkoutUpdateComponent],
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
      .overrideTemplate(WorkoutUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workoutFormService = TestBed.inject(WorkoutFormService);
    workoutService = TestBed.inject(WorkoutService);
    workoutRatingService = TestBed.inject(WorkoutRatingService);
    userDetailsService = TestBed.inject(UserDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call workoutRating query and add missing value', () => {
      const workout: IWorkout = { id: 456 };
      const workoutRating: IWorkoutRating = { id: 35584 };
      workout.workoutRating = workoutRating;

      const workoutRatingCollection: IWorkoutRating[] = [{ id: 19016 }];
      jest.spyOn(workoutRatingService, 'query').mockReturnValue(of(new HttpResponse({ body: workoutRatingCollection })));
      const expectedCollection: IWorkoutRating[] = [workoutRating, ...workoutRatingCollection];
      jest.spyOn(workoutRatingService, 'addWorkoutRatingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      expect(workoutRatingService.query).toHaveBeenCalled();
      expect(workoutRatingService.addWorkoutRatingToCollectionIfMissing).toHaveBeenCalledWith(workoutRatingCollection, workoutRating);
      expect(comp.workoutRatingsCollection).toEqual(expectedCollection);
    });

    it('Should call UserDetails query and add missing value', () => {
      const workout: IWorkout = { id: 456 };
      const userDetails: IUserDetails = { id: 34563 };
      workout.userDetails = userDetails;

      const userDetailsCollection: IUserDetails[] = [{ id: 72279 }];
      jest.spyOn(userDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: userDetailsCollection })));
      const additionalUserDetails = [userDetails];
      const expectedCollection: IUserDetails[] = [...additionalUserDetails, ...userDetailsCollection];
      jest.spyOn(userDetailsService, 'addUserDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      expect(userDetailsService.query).toHaveBeenCalled();
      expect(userDetailsService.addUserDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        userDetailsCollection,
        ...additionalUserDetails.map(expect.objectContaining)
      );
      expect(comp.userDetailsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const workout: IWorkout = { id: 456 };
      const workoutRating: IWorkoutRating = { id: 4935 };
      workout.workoutRating = workoutRating;
      const userDetails: IUserDetails = { id: 44269 };
      workout.userDetails = userDetails;

      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      expect(comp.workoutRatingsCollection).toContain(workoutRating);
      expect(comp.userDetailsSharedCollection).toContain(userDetails);
      expect(comp.workout).toEqual(workout);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkout>>();
      const workout = { id: 123 };
      jest.spyOn(workoutFormService, 'getWorkout').mockReturnValue(workout);
      jest.spyOn(workoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workout }));
      saveSubject.complete();

      // THEN
      expect(workoutFormService.getWorkout).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(workoutService.update).toHaveBeenCalledWith(expect.objectContaining(workout));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkout>>();
      const workout = { id: 123 };
      jest.spyOn(workoutFormService, 'getWorkout').mockReturnValue({ id: null });
      jest.spyOn(workoutService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workout: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workout }));
      saveSubject.complete();

      // THEN
      expect(workoutFormService.getWorkout).toHaveBeenCalled();
      expect(workoutService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkout>>();
      const workout = { id: 123 };
      jest.spyOn(workoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workoutService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareWorkoutRating', () => {
      it('Should forward to workoutRatingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(workoutRatingService, 'compareWorkoutRating');
        comp.compareWorkoutRating(entity, entity2);
        expect(workoutRatingService.compareWorkoutRating).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserDetails', () => {
      it('Should forward to userDetailsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userDetailsService, 'compareUserDetails');
        comp.compareUserDetails(entity, entity2);
        expect(userDetailsService.compareUserDetails).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
