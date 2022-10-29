import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISportDiscipline } from '../sport-discipline.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sport-discipline.test-samples';

import { SportDisciplineService } from './sport-discipline.service';

const requireRestSample: ISportDiscipline = {
  ...sampleWithRequiredData,
};

describe('SportDiscipline Service', () => {
  let service: SportDisciplineService;
  let httpMock: HttpTestingController;
  let expectedResult: ISportDiscipline | ISportDiscipline[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SportDisciplineService);
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

    it('should create a SportDiscipline', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sportDiscipline = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sportDiscipline).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SportDiscipline', () => {
      const sportDiscipline = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sportDiscipline).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SportDiscipline', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SportDiscipline', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SportDiscipline', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSportDisciplineToCollectionIfMissing', () => {
      it('should add a SportDiscipline to an empty array', () => {
        const sportDiscipline: ISportDiscipline = sampleWithRequiredData;
        expectedResult = service.addSportDisciplineToCollectionIfMissing([], sportDiscipline);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sportDiscipline);
      });

      it('should not add a SportDiscipline to an array that contains it', () => {
        const sportDiscipline: ISportDiscipline = sampleWithRequiredData;
        const sportDisciplineCollection: ISportDiscipline[] = [
          {
            ...sportDiscipline,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSportDisciplineToCollectionIfMissing(sportDisciplineCollection, sportDiscipline);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SportDiscipline to an array that doesn't contain it", () => {
        const sportDiscipline: ISportDiscipline = sampleWithRequiredData;
        const sportDisciplineCollection: ISportDiscipline[] = [sampleWithPartialData];
        expectedResult = service.addSportDisciplineToCollectionIfMissing(sportDisciplineCollection, sportDiscipline);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sportDiscipline);
      });

      it('should add only unique SportDiscipline to an array', () => {
        const sportDisciplineArray: ISportDiscipline[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sportDisciplineCollection: ISportDiscipline[] = [sampleWithRequiredData];
        expectedResult = service.addSportDisciplineToCollectionIfMissing(sportDisciplineCollection, ...sportDisciplineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sportDiscipline: ISportDiscipline = sampleWithRequiredData;
        const sportDiscipline2: ISportDiscipline = sampleWithPartialData;
        expectedResult = service.addSportDisciplineToCollectionIfMissing([], sportDiscipline, sportDiscipline2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sportDiscipline);
        expect(expectedResult).toContain(sportDiscipline2);
      });

      it('should accept null and undefined values', () => {
        const sportDiscipline: ISportDiscipline = sampleWithRequiredData;
        expectedResult = service.addSportDisciplineToCollectionIfMissing([], null, sportDiscipline, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sportDiscipline);
      });

      it('should return initial array if no SportDiscipline is added', () => {
        const sportDisciplineCollection: ISportDiscipline[] = [sampleWithRequiredData];
        expectedResult = service.addSportDisciplineToCollectionIfMissing(sportDisciplineCollection, undefined, null);
        expect(expectedResult).toEqual(sportDisciplineCollection);
      });
    });

    describe('compareSportDiscipline', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSportDiscipline(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSportDiscipline(entity1, entity2);
        const compareResult2 = service.compareSportDiscipline(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSportDiscipline(entity1, entity2);
        const compareResult2 = service.compareSportDiscipline(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSportDiscipline(entity1, entity2);
        const compareResult2 = service.compareSportDiscipline(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
