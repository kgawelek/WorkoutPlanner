import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WorkoutBreakdownService } from '../service/workout-breakdown.service';

import { WorkoutBreakdownComponent } from './workout-breakdown.component';

describe('WorkoutBreakdown Management Component', () => {
  let comp: WorkoutBreakdownComponent;
  let fixture: ComponentFixture<WorkoutBreakdownComponent>;
  let service: WorkoutBreakdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'workout-breakdown', component: WorkoutBreakdownComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [WorkoutBreakdownComponent],
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
      .overrideTemplate(WorkoutBreakdownComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutBreakdownComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkoutBreakdownService);

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
    expect(comp.workoutBreakdowns?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to workoutBreakdownService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWorkoutBreakdownIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWorkoutBreakdownIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
