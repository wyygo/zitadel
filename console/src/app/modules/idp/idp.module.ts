import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { DetailLayoutModule } from 'src/app/modules/detail-layout/detail-layout.module';

import { CommonElementsModule } from '../common-elements/common-elements.module';
import { InfoRowModule } from '../info-row/info-row.module';
import { InfoSectionModule } from '../info-section/info-section.module';
import { WarnDialogModule } from '../warn-dialog/warn-dialog.module';
import { IdpRoutingModule } from './idp-routing.module';
import { IdpComponent } from './idp.component';

@NgModule({
  declarations: [IdpComponent],
  imports: [
    CommonElementsModule,
    IdpRoutingModule,
    WarnDialogModule,
    MatIconModule,
    InfoSectionModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    InfoRowModule,
    MatChipsModule,
    DetailLayoutModule,
  ],
})
export class IdpModule {}
