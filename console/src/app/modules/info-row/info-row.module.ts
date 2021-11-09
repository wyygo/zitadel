import { NgModule } from '@angular/core';
import { CopyToClipboardModule } from 'src/app/directives/copy-to-clipboard/copy-to-clipboard.module';
import { LocalizedDatePipeModule } from 'src/app/pipes/localized-date-pipe/localized-date-pipe.module';
import { TimestampToDatePipeModule } from 'src/app/pipes/timestamp-to-date-pipe/timestamp-to-date-pipe.module';

import { CommonElementsModule } from '../common-elements/common-elements.module';
import { InfoRowComponent } from './info-row.component';

@NgModule({
  declarations: [InfoRowComponent],
  imports: [CommonElementsModule, CopyToClipboardModule, LocalizedDatePipeModule, TimestampToDatePipeModule],
  exports: [InfoRowComponent],
})
export class InfoRowModule {}
