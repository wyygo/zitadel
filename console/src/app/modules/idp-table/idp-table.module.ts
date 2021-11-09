import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HasRoleModule } from 'src/app/directives/has-role/has-role.module';
import { RefreshTableModule } from 'src/app/modules/refresh-table/refresh-table.module';
import { LocalizedDatePipeModule } from 'src/app/pipes/localized-date-pipe/localized-date-pipe.module';
import { TimestampToDatePipeModule } from 'src/app/pipes/timestamp-to-date-pipe/timestamp-to-date-pipe.module';
import { TruncatePipeModule } from 'src/app/pipes/truncate-pipe/truncate-pipe.module';

import { CommonElementsModule } from '../common-elements/common-elements.module';
import { PaginatorModule } from '../paginator/paginator.module';
import { IdpTableComponent } from './idp-table.component';

@NgModule({
  declarations: [IdpTableComponent],
  imports: [
    CommonElementsModule,
    MatCheckboxModule,
    LocalizedDatePipeModule,
    TimestampToDatePipeModule,
    MatTableModule,
    PaginatorModule,
    RouterModule,
    RefreshTableModule,
    HasRoleModule,
    TruncatePipeModule,
  ],
  exports: [IdpTableComponent],
})
export class IdpTableModule {}
