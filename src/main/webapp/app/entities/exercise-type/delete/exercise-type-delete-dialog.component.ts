import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExerciseType } from '../exercise-type.model';
import { ExerciseTypeService } from '../service/exercise-type.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './exercise-type-delete-dialog.component.html',
})
export class ExerciseTypeDeleteDialogComponent {
  exerciseType?: IExerciseType;

  constructor(protected exerciseTypeService: ExerciseTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerciseTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
