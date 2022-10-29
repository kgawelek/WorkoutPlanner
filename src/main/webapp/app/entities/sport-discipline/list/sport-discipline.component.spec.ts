import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SportDisciplineService } from '../service/sport-discipline.service';

import { SportDisciplineComponent } from './sport-discipline.component';

describe('SportDiscipline Management Component', () => {
  let comp: SportDisciplineComponent;
  let fixture: ComponentFixture<SportDisciplineComponent>;
  let service: SportDisciplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'sport-discipline', component: SportDisciplineComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [SportDisciplineComponent],
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
      .overrideTemplate(SportDisciplineComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SportDisciplineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SportDisciplineService);

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
    expect(comp.sportDisciplines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to sportDisciplineService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSportDisciplineIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSportDisciplineIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
