import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HasRoleModule } from 'src/app/directives/has-role/has-role.module';
import { AddKeyDialogModule } from 'src/app/modules/add-key-dialog/add-key-dialog.module';
import { HasRolePipeModule } from 'src/app/pipes/has-role-pipe/has-role-pipe.module';
import { LocalizedDatePipeModule } from 'src/app/pipes/localized-date-pipe/localized-date-pipe.module';
import { TimestampToDatePipeModule } from 'src/app/pipes/timestamp-to-date-pipe/timestamp-to-date-pipe.module';

import { CardModule } from '../card/card.module';
import { CommonElementsModule } from '../common-elements/common-elements.module';
import { PaginatorModule } from '../paginator/paginator.module';
import { RefreshTableModule } from '../refresh-table/refresh-table.module';
import { ShowKeyDialogModule } from '../show-key-dialog/show-key-dialog.module';
import { MachineKeysComponent } from './machine-keys.component';

@NgModule({
  declarations: [MachineKeysComponent],
  imports: [
    CommonElementsModule,
    RouterModule,
    MatDialogModule,
    HasRoleModule,
    CardModule,
    MatTableModule,
    PaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    HasRolePipeModule,
    TimestampToDatePipeModule,
    LocalizedDatePipeModule,
    RefreshTableModule,
    ShowKeyDialogModule,
    AddKeyDialogModule,
  ],
  exports: [MachineKeysComponent],
})
export class MachineKeysModule {}
