import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExerciseTypeDetailComponent } from './exercise-type-detail.component';

describe('ExerciseType Management Detail Component', () => {
  let comp: ExerciseTypeDetailComponent;
  let fixture: ComponentFixture<ExerciseTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ exerciseType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExerciseTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExerciseTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load exerciseType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.exerciseType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
