import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SearchUserAutocompleteModule } from 'src/app/modules/search-user-autocomplete/search-user-autocomplete.module';

import {
  OrgMemberRolesAutocompleteModule,
} from '../../pages/orgs/org-member-roles-autocomplete/org-member-roles-autocomplete.module';
import { CommonElementsModule } from '../common-elements/common-elements.module';
import { SearchProjectAutocompleteModule } from '../search-project-autocomplete/search-project-autocomplete.module';
import { SearchRolesAutocompleteModule } from '../search-roles-autocomplete/search-roles-autocomplete.module';
import { MemberCreateDialogComponent } from './member-create-dialog.component';

@NgModule({
  declarations: [MemberCreateDialogComponent],
  imports: [
    CommonElementsModule,
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    SearchUserAutocompleteModule,
    SearchRolesAutocompleteModule,
    SearchProjectAutocompleteModule,
    OrgMemberRolesAutocompleteModule,
  ],
})
export class MemberCreateDialogModule {}
