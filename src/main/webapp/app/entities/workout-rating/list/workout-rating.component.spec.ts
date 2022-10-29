import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WorkoutRatingService } from '../service/workout-rating.service';

import { WorkoutRatingComponent } from './workout-rating.component';

describe('WorkoutRating Management Component', () => {
  let comp: WorkoutRatingComponent;
  let fixture: ComponentFixture<WorkoutRatingComponent>;
  let service: WorkoutRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'workout-rating', component: WorkoutRatingComponent }]), HttpClientTestingModule],
      declarations: [WorkoutRatingComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(WorkoutRatingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutRatingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkoutRatingService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.workoutRatings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to workoutRatingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWorkoutRatingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWorkoutRatingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
