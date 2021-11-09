import { NgModule } from '@angular/core';

import { CommonElementsModule } from '../common-elements/common-elements.module';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonElementsModule],
  exports: [CardComponent],
})
export class CardModule {}
