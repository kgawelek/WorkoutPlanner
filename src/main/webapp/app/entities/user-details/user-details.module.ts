import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserDetailsUpdateComponent } from './update/user-details-update.component';
import { UserDetailsRoutingModule } from './route/user-details-routing.module';

@NgModule({
  imports: [SharedModule, UserDetailsRoutingModule],
  declarations: [UserDetailsUpdateComponent],
})
export class UserDetailsModule {}
