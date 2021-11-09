import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AvatarModule } from '../avatar/avatar.module';
import { CommonElementsModule } from '../common-elements/common-elements.module';
import { ContributorsComponent } from './contributors.component';

@NgModule({
  declarations: [ContributorsComponent],
  imports: [CommonElementsModule, AvatarModule, MatProgressSpinnerModule],
  exports: [ContributorsComponent],
})
export class ContributorsModule {}
