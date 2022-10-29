import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SportDisciplineDetailComponent } from './sport-discipline-detail.component';

describe('SportDiscipline Management Detail Component', () => {
  let comp: SportDisciplineDetailComponent;
  let fixture: ComponentFixture<SportDisciplineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SportDisciplineDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sportDiscipline: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SportDisciplineDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SportDisciplineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sportDiscipline on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sportDiscipline).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
