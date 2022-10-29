import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserDetailsFormService } from './user-details-form.service';
import { UserDetailsService } from '../service/user-details.service';
import { IUserDetails } from '../user-details.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISportDiscipline } from 'app/entities/sport-discipline/sport-discipline.model';
import { SportDisciplineService } from 'app/entities/sport-discipline/service/sport-discipline.service';

import { UserDetailsUpdateComponent } from './user-details-update.component';

describe('UserDetails Management Update Component', () => {
  let comp: UserDetailsUpdateComponent;
  let fixture: ComponentFixture<UserDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userDetailsFormService: UserDetailsFormService;
  let userDetailsService: UserDetailsService;
  let userService: UserService;
  let sportDisciplineService: SportDisciplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserDetailsUpdateComponent],
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
      .overrideTemplate(UserDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userDetailsFormService = TestBed.inject(UserDetailsFormService);
    userDetailsService = TestBed.inject(UserDetailsService);
    userService = TestBed.inject(UserService);
    sportDisciplineService = TestBed.inject(SportDisciplineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userDetails: IUserDetails = { id: 456 };
      const user: IUser = { id: 48561 };
      userDetails.user = user;

      const userCollection: IUser[] = [{ id: 28523 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SportDiscipline query and add missing value', () => {
      const userDetails: IUserDetails = { id: 456 };
      const sportDiscipline: ISportDiscipline = { id: 28192 };
      userDetails.sportDiscipline = sportDiscipline;

      const sportDisciplineCollection: ISportDiscipline[] = [{ id: 40647 }];
      jest.spyOn(sportDisciplineService, 'query').mockReturnValue(of(new HttpResponse({ body: sportDisciplineCollection })));
      const additionalSportDisciplines = [sportDiscipline];
      const expectedCollection: ISportDiscipline[] = [...additionalSportDisciplines, ...sportDisciplineCollection];
      jest.spyOn(sportDisciplineService, 'addSportDisciplineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(sportDisciplineService.query).toHaveBeenCalled();
      expect(sportDisciplineService.addSportDisciplineToCollectionIfMissing).toHaveBeenCalledWith(
        sportDisciplineCollection,
        ...additionalSportDisciplines.map(expect.objectContaining)
      );
      expect(comp.sportDisciplinesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userDetails: IUserDetails = { id: 456 };
      const user: IUser = { id: 76901 };
      userDetails.user = user;
      const sportDiscipline: ISportDiscipline = { id: 48279 };
      userDetails.sportDiscipline = sportDiscipline;

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.sportDisciplinesSharedCollection).toContain(sportDiscipline);
      expect(comp.userDetails).toEqual(userDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDetails>>();
      const userDetails = { id: 123 };
      jest.spyOn(userDetailsFormService, 'getUserDetails').mockReturnValue(userDetails);
      jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDetails }));
      saveSubject.complete();

      // THEN
      expect(userDetailsFormService.getUserDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(userDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDetails>>();
      const userDetails = { id: 123 };
      jest.spyOn(userDetailsFormService, 'getUserDetails').mockReturnValue({ id: null });
      jest.spyOn(userDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDetails }));
      saveSubject.complete();

      // THEN
      expect(userDetailsFormService.getUserDetails).toHaveBeenCalled();
      expect(userDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDetails>>();
      const userDetails = { id: 123 };
      jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSportDiscipline', () => {
      it('Should forward to sportDisciplineService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sportDisciplineService, 'compareSportDiscipline');
        comp.compareSportDiscipline(entity, entity2);
        expect(sportDisciplineService.compareSportDiscipline).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
