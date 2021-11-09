import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OutsideClickModule } from 'src/app/directives/outside-click/outside-click.module';

import { AvatarModule } from '../avatar/avatar.module';
import { CommonElementsModule } from '../common-elements/common-elements.module';
import { AccountsCardComponent } from './accounts-card.component';

@NgModule({
  declarations: [AccountsCardComponent],
  imports: [MatProgressBarModule, OutsideClickModule, AvatarModule, CommonElementsModule],
  exports: [AccountsCardComponent],
})
export class AccountsCardModule {}
