import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorkoutRatingDetailComponent } from './workout-rating-detail.component';

describe('WorkoutRating Management Detail Component', () => {
  let comp: WorkoutRatingDetailComponent;
  let fixture: ComponentFixture<WorkoutRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ workoutRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WorkoutRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorkoutRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load workoutRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.workoutRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
