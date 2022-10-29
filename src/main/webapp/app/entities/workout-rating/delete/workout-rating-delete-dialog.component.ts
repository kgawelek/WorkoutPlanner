import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkoutRating } from '../workout-rating.model';
import { WorkoutRatingService } from '../service/workout-rating.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './workout-rating-delete-dialog.component.html',
})
export class WorkoutRatingDeleteDialogComponent {
  workoutRating?: IWorkoutRating;

  constructor(protected workoutRatingService: WorkoutRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.workoutRatingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
