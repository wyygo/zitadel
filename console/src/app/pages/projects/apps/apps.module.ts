import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CopyToClipboardModule } from 'src/app/directives/copy-to-clipboard/copy-to-clipboard.module';
import { HasRoleModule } from 'src/app/directives/has-role/has-role.module';
import { AppRadioModule } from 'src/app/modules/app-radio/app-radio.module';
import { CardModule } from 'src/app/modules/card/card.module';
import { ChangesModule } from 'src/app/modules/changes/changes.module';
import { ClientKeysModule } from 'src/app/modules/client-keys/client-keys.module';
import { InfoRowModule } from 'src/app/modules/info-row/info-row.module';
import { InfoSectionModule } from 'src/app/modules/info-section/info-section.module';
import { InputModule } from 'src/app/modules/input/input.module';
import { LinksModule } from 'src/app/modules/links/links.module';
import { MetaLayoutModule } from 'src/app/modules/meta-layout/meta-layout.module';
import { NameDialogModule } from 'src/app/modules/name-dialog/name-dialog.module';
import { OriginPipeModule } from 'src/app/pipes/origin-pipe/origin-pipe.module';
import { RedirectPipeModule } from 'src/app/pipes/redirect-pipe/redirect-pipe.module';

import { AdditionalOriginsComponent } from './additional-origins/additional-origins.component';
import { AppCreateComponent } from './app-create/app-create.component';
import { AppDetailComponent } from './app-detail/app-detail.component';
import { AppSecretDialogComponent } from './app-secret-dialog/app-secret-dialog.component';
import { AppsRoutingModule } from './apps-routing.module';
import { RedirectUrisComponent } from './redirect-uris/redirect-uris.component';

@NgModule({
  declarations: [
    AppCreateComponent,
    AppDetailComponent,
    AppSecretDialogComponent,
    RedirectUrisComponent,
    AdditionalOriginsComponent,
  ],
  imports: [
    CommonModule,
    A11yModule,
    RedirectPipeModule,
    LinksModule,
    NameDialogModule,
    AppRadioModule,
    AppsRoutingModule,
    FormsModule,
    InfoRowModule,
    TranslateModule,
    OriginPipeModule,
    MatMenuModule,
    ReactiveFormsModule,
    HasRoleModule,
    MatMenuModule,
    MatChipsModule,
    ClientKeysModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatCheckboxModule,
    CardModule,
    MatTooltipModule,
    TranslateModule,
    MatStepperModule,
    MatRadioModule,
    CopyToClipboardModule,
    MatSlideToggleModule,
    InputModule,
    MetaLayoutModule,
    MatSliderModule,
    ChangesModule,
    InfoSectionModule,
  ],
  exports: [TranslateModule],
})
export class AppsModule {}
