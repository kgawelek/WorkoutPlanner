import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWorkoutRating } from '../workout-rating.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../workout-rating.test-samples';

import { WorkoutRatingService } from './workout-rating.service';

const requireRestSample: IWorkoutRating = {
  ...sampleWithRequiredData,
};

describe('WorkoutRating Service', () => {
  let service: WorkoutRatingService;
  let httpMock: HttpTestingController;
  let expectedResult: IWorkoutRating | IWorkoutRating[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorkoutRatingService);
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

    it('should create a WorkoutRating', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const workoutRating = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(workoutRating).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WorkoutRating', () => {
      const workoutRating = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(workoutRating).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a WorkoutRating', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WorkoutRating', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a WorkoutRating', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWorkoutRatingToCollectionIfMissing', () => {
      it('should add a WorkoutRating to an empty array', () => {
        const workoutRating: IWorkoutRating = sampleWithRequiredData;
        expectedResult = service.addWorkoutRatingToCollectionIfMissing([], workoutRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workoutRating);
      });

      it('should not add a WorkoutRating to an array that contains it', () => {
        const workoutRating: IWorkoutRating = sampleWithRequiredData;
        const workoutRatingCollection: IWorkoutRating[] = [
          {
            ...workoutRating,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWorkoutRatingToCollectionIfMissing(workoutRatingCollection, workoutRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WorkoutRating to an array that doesn't contain it", () => {
        const workoutRating: IWorkoutRating = sampleWithRequiredData;
        const workoutRatingCollection: IWorkoutRating[] = [sampleWithPartialData];
        expectedResult = service.addWorkoutRatingToCollectionIfMissing(workoutRatingCollection, workoutRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workoutRating);
      });

      it('should add only unique WorkoutRating to an array', () => {
        const workoutRatingArray: IWorkoutRating[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const workoutRatingCollection: IWorkoutRating[] = [sampleWithRequiredData];
        expectedResult = service.addWorkoutRatingToCollectionIfMissing(workoutRatingCollection, ...workoutRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const workoutRating: IWorkoutRating = sampleWithRequiredData;
        const workoutRating2: IWorkoutRating = sampleWithPartialData;
        expectedResult = service.addWorkoutRatingToCollectionIfMissing([], workoutRating, workoutRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workoutRating);
        expect(expectedResult).toContain(workoutRating2);
      });

      it('should accept null and undefined values', () => {
        const workoutRating: IWorkoutRating = sampleWithRequiredData;
        expectedResult = service.addWorkoutRatingToCollectionIfMissing([], null, workoutRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workoutRating);
      });

      it('should return initial array if no WorkoutRating is added', () => {
        const workoutRatingCollection: IWorkoutRating[] = [sampleWithRequiredData];
        expectedResult = service.addWorkoutRatingToCollectionIfMissing(workoutRatingCollection, undefined, null);
        expect(expectedResult).toEqual(workoutRatingCollection);
      });
    });

    describe('compareWorkoutRating', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWorkoutRating(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWorkoutRating(entity1, entity2);
        const compareResult2 = service.compareWorkoutRating(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWorkoutRating(entity1, entity2);
        const compareResult2 = service.compareWorkoutRating(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWorkoutRating(entity1, entity2);
        const compareResult2 = service.compareWorkoutRating(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
