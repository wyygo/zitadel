import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HasRoleModule } from 'src/app/directives/has-role/has-role.module';
import { DetailLayoutModule } from 'src/app/modules/detail-layout/detail-layout.module';
import { HasRolePipeModule } from 'src/app/pipes/has-role-pipe/has-role-pipe.module';
import {
  TimestampToRetentionPipeModule,
} from 'src/app/pipes/timestamp-to-retention-pipe/timestamp-to-retention-pipe.module';

import { CommonElementsModule } from '../common-elements/common-elements.module';
import { InfoSectionModule } from '../info-section/info-section.module';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeaturesComponent } from './features.component';
import { PaymentInfoDialogComponent } from './payment-info-dialog/payment-info-dialog.component';

@NgModule({
  declarations: [FeaturesComponent, PaymentInfoDialogComponent],
  imports: [
    FeaturesRoutingModule,
    CommonElementsModule,
    HasRoleModule,
    MatSlideToggleModule,
    MatSelectModule,
    HasRoleModule,
    HasRolePipeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    InfoSectionModule,
    DetailLayoutModule,
    TimestampToRetentionPipeModule,
  ],
  exports: [FeaturesComponent],
})
export class FeaturesModule {}
