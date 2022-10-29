import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorkoutBreakdownDetailComponent } from './workout-breakdown-detail.component';

describe('WorkoutBreakdown Management Detail Component', () => {
  let comp: WorkoutBreakdownDetailComponent;
  let fixture: ComponentFixture<WorkoutBreakdownDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutBreakdownDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ workoutBreakdown: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WorkoutBreakdownDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorkoutBreakdownDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load workoutBreakdown on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.workoutBreakdown).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
