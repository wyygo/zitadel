import { NgModule } from '@angular/core';
import { CopyToClipboardModule } from 'src/app/directives/copy-to-clipboard/copy-to-clipboard.module';

import { CommonElementsModule } from '../common-elements/common-elements.module';
import { InfoSectionModule } from '../info-section/info-section.module';
import { EditTextComponent } from './edit-text.component';

@NgModule({
  declarations: [EditTextComponent],
  imports: [CommonElementsModule, InfoSectionModule, CopyToClipboardModule],
  exports: [EditTextComponent],
})
export class EditTextModule {}
