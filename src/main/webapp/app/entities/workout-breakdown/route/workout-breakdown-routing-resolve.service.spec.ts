import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IWorkoutBreakdown } from '../workout-breakdown.model';
import { WorkoutBreakdownService } from '../service/workout-breakdown.service';

import { WorkoutBreakdownRoutingResolveService } from './workout-breakdown-routing-resolve.service';

describe('WorkoutBreakdown routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: WorkoutBreakdownRoutingResolveService;
  let service: WorkoutBreakdownService;
  let resultWorkoutBreakdown: IWorkoutBreakdown | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(WorkoutBreakdownRoutingResolveService);
    service = TestBed.inject(WorkoutBreakdownService);
    resultWorkoutBreakdown = undefined;
  });

  describe('resolve', () => {
    it('should return IWorkoutBreakdown returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorkoutBreakdown = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWorkoutBreakdown).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorkoutBreakdown = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultWorkoutBreakdown).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IWorkoutBreakdown>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorkoutBreakdown = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWorkoutBreakdown).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
