jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { WorkoutBreakdownService } from '../service/workout-breakdown.service';

import { WorkoutBreakdownDeleteDialogComponent } from './workout-breakdown-delete-dialog.component';

describe('WorkoutBreakdown Management Delete Component', () => {
  let comp: WorkoutBreakdownDeleteDialogComponent;
  let fixture: ComponentFixture<WorkoutBreakdownDeleteDialogComponent>;
  let service: WorkoutBreakdownService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorkoutBreakdownDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(WorkoutBreakdownDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorkoutBreakdownDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkoutBreakdownService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
