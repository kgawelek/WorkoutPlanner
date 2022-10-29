import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkoutBreakdown } from '../workout-breakdown.model';
import { WorkoutBreakdownService } from '../service/workout-breakdown.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './workout-breakdown-delete-dialog.component.html',
})
export class WorkoutBreakdownDeleteDialogComponent {
  workoutBreakdown?: IWorkoutBreakdown;

  constructor(protected workoutBreakdownService: WorkoutBreakdownService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.workoutBreakdownService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
