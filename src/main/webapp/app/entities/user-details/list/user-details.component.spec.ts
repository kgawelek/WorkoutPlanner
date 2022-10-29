import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserDetailsService } from '../service/user-details.service';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetails Management Component', () => {
  let comp: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let service: UserDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-details', component: UserDetailsComponent }]), HttpClientTestingModule],
      declarations: [UserDetailsComponent],
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
      .overrideTemplate(UserDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserDetailsService);

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
    expect(comp.userDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userDetailsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserDetailsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserDetailsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
