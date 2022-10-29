import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISportDiscipline } from '../sport-discipline.model';
import { SportDisciplineService } from '../service/sport-discipline.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sport-discipline-delete-dialog.component.html',
})
export class SportDisciplineDeleteDialogComponent {
  sportDiscipline?: ISportDiscipline;

  constructor(protected sportDisciplineService: SportDisciplineService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sportDisciplineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
