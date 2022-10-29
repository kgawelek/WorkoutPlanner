import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWorkoutBreakdown } from '../workout-breakdown.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../workout-breakdown.test-samples';

import { WorkoutBreakdownService } from './workout-breakdown.service';

const requireRestSample: IWorkoutBreakdown = {
  ...sampleWithRequiredData,
};

describe('WorkoutBreakdown Service', () => {
  let service: WorkoutBreakdownService;
  let httpMock: HttpTestingController;
  let expectedResult: IWorkoutBreakdown | IWorkoutBreakdown[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorkoutBreakdownService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a WorkoutBreakdown', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const workoutBreakdown = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(workoutBreakdown).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WorkoutBreakdown', () => {
      const workoutBreakdown = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(workoutBreakdown).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a WorkoutBreakdown', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WorkoutBreakdown', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a WorkoutBreakdown', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWorkoutBreakdownToCollectionIfMissing', () => {
      it('should add a WorkoutBreakdown to an empty array', () => {
        const workoutBreakdown: IWorkoutBreakdown = sampleWithRequiredData;
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing([], workoutBreakdown);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workoutBreakdown);
      });

      it('should not add a WorkoutBreakdown to an array that contains it', () => {
        const workoutBreakdown: IWorkoutBreakdown = sampleWithRequiredData;
        const workoutBreakdownCollection: IWorkoutBreakdown[] = [
          {
            ...workoutBreakdown,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing(workoutBreakdownCollection, workoutBreakdown);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WorkoutBreakdown to an array that doesn't contain it", () => {
        const workoutBreakdown: IWorkoutBreakdown = sampleWithRequiredData;
        const workoutBreakdownCollection: IWorkoutBreakdown[] = [sampleWithPartialData];
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing(workoutBreakdownCollection, workoutBreakdown);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workoutBreakdown);
      });

      it('should add only unique WorkoutBreakdown to an array', () => {
        const workoutBreakdownArray: IWorkoutBreakdown[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const workoutBreakdownCollection: IWorkoutBreakdown[] = [sampleWithRequiredData];
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing(workoutBreakdownCollection, ...workoutBreakdownArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const workoutBreakdown: IWorkoutBreakdown = sampleWithRequiredData;
        const workoutBreakdown2: IWorkoutBreakdown = sampleWithPartialData;
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing([], workoutBreakdown, workoutBreakdown2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workoutBreakdown);
        expect(expectedResult).toContain(workoutBreakdown2);
      });

      it('should accept null and undefined values', () => {
        const workoutBreakdown: IWorkoutBreakdown = sampleWithRequiredData;
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing([], null, workoutBreakdown, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workoutBreakdown);
      });

      it('should return initial array if no WorkoutBreakdown is added', () => {
        const workoutBreakdownCollection: IWorkoutBreakdown[] = [sampleWithRequiredData];
        expectedResult = service.addWorkoutBreakdownToCollectionIfMissing(workoutBreakdownCollection, undefined, null);
        expect(expectedResult).toEqual(workoutBreakdownCollection);
      });
    });

    describe('compareWorkoutBreakdown', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWorkoutBreakdown(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWorkoutBreakdown(entity1, entity2);
        const compareResult2 = service.compareWorkoutBreakdown(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWorkoutBreakdown(entity1, entity2);
        const compareResult2 = service.compareWorkoutBreakdown(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWorkoutBreakdown(entity1, entity2);
        const compareResult2 = service.compareWorkoutBreakdown(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
