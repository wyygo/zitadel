import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, Type } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddOIDCIDPRequest } from 'src/app/proto/generated/zitadel/admin_pb';
import { OIDCMappingField } from 'src/app/proto/generated/zitadel/idp_pb';
import { AddOrgOIDCIDPRequest } from 'src/app/proto/generated/zitadel/management_pb';
import { AdminService } from 'src/app/services/admin.service';
import { ManagementService } from 'src/app/services/mgmt.service';
import { ToastService } from 'src/app/services/toast.service';

import { PolicyComponentServiceType } from '../policies/policy-component-types.enum';

@Component({
  selector: 'cnsl-idp-create',
  templateUrl: './idp-create.component.html',
  styleUrls: ['./idp-create.component.scss'],
})
export class IdpCreateComponent implements OnInit, OnDestroy {
  public serviceType: PolicyComponentServiceType = PolicyComponentServiceType.MGMT;
  private service!: ManagementService | AdminService;
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  public mappingFields: OIDCMappingField[] = [];

  private subscription?: Subscription;
  public projectId: string = '';

  public formGroup!: FormGroup;
  public createSteps: number = 1;
  public currentCreateStep: number = 1;
  public loading: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private injector: Injector,
    private _location: Location,
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      clientId: new FormControl('', [Validators.required]),
      clientSecret: new FormControl('', [Validators.required]),
      issuer: new FormControl('', [Validators.required]),
      scopesList: new FormControl(['openid', 'profile', 'email'], []),
      idpDisplayNameMapping: new FormControl(0),
      usernameMapping: new FormControl(0),
      autoRegister: new FormControl(false),
    });

    this.route.data.pipe(take(1)).subscribe((data) => {
      this.serviceType = data.serviceType;
      switch (this.serviceType) {
        case PolicyComponentServiceType.MGMT:
          this.service = this.injector.get(ManagementService as Type<ManagementService>);
          this.mappingFields = [
            OIDCMappingField.OIDC_MAPPING_FIELD_PREFERRED_USERNAME,
            OIDCMappingField.OIDC_MAPPING_FIELD_EMAIL,
          ];
          break;
        case PolicyComponentServiceType.ADMIN:
          this.service = this.injector.get(AdminService as Type<AdminService>);
          this.mappingFields = [
            OIDCMappingField.OIDC_MAPPING_FIELD_PREFERRED_USERNAME,
            OIDCMappingField.OIDC_MAPPING_FIELD_EMAIL,
          ];
          break;
      }
    });
  }

  public ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params) => this.getData(params));
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private getData({ projectid }: Params): void {
    this.projectId = projectid;
  }

  public addIdp(): void {
    if (this.serviceType === PolicyComponentServiceType.MGMT) {
      const req = new AddOrgOIDCIDPRequest();

      req.setName(this.name?.value);
      req.setClientId(this.clientId?.value);
      req.setClientSecret(this.clientSecret?.value);
      req.setIssuer(this.issuer?.value);
      req.setScopesList(this.scopesList?.value);
      req.setDisplayNameMapping(this.idpDisplayNameMapping?.value);
      req.setUsernameMapping(this.usernameMapping?.value);
      req.setAutoRegister(this.autoRegister?.value);

      this.loading = true;
      (this.service as ManagementService)
        .addOrgOIDCIDP(req)
        .then((idp) => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigate([
              this.serviceType === PolicyComponentServiceType.MGMT
                ? 'org'
                : this.serviceType === PolicyComponentServiceType.ADMIN
                ? 'iam'
                : '',
              'policy',
              'login',
            ]);
          }, 2000);
        })
        .catch((error) => {
          this.toast.showError(error);
        });
    } else if (PolicyComponentServiceType.ADMIN) {
      const req = new AddOIDCIDPRequest();
      req.setName(this.name?.value);
      req.setClientId(this.clientId?.value);
      req.setClientSecret(this.clientSecret?.value);
      req.setIssuer(this.issuer?.value);
      req.setScopesList(this.scopesList?.value);
      req.setDisplayNameMapping(this.idpDisplayNameMapping?.value);
      req.setUsernameMapping(this.usernameMapping?.value);
      req.setAutoRegister(this.autoRegister?.value);

      this.loading = true;
      (this.service as AdminService)
        .addOIDCIDP(req)
        .then((idp) => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigate([
              this.serviceType === PolicyComponentServiceType.MGMT
                ? 'org'
                : this.serviceType === PolicyComponentServiceType.ADMIN
                ? 'iam'
                : '',
              'policy',
              'login',
            ]);
          }, 2000);
        })
        .catch((error) => {
          this.toast.showError(error);
        });
    }
  }

  public close(): void {
    this._location.back();
  }

  public addScope(event: MatChipInputEvent): void {
    const input = event.chipInput?.inputElement;
    const value = event.value.trim();

    if (value !== '') {
      if (this.scopesList?.value) {
        this.scopesList.value.push(value);
        if (input) {
          input.value = '';
        }
      }
    }
  }

  public removeScope(uri: string): void {
    if (this.scopesList?.value) {
      const index = this.scopesList.value.indexOf(uri);

      if (index !== undefined && index >= 0) {
        this.scopesList.value.splice(index, 1);
      }
    }
  }

  public get name(): AbstractControl | null {
    return this.formGroup.get('name');
  }

  public get clientId(): AbstractControl | null {
    return this.formGroup.get('clientId');
  }

  public get clientSecret(): AbstractControl | null {
    return this.formGroup.get('clientSecret');
  }

  public get issuer(): AbstractControl | null {
    return this.formGroup.get('issuer');
  }

  public get scopesList(): AbstractControl | null {
    return this.formGroup.get('scopesList');
  }

  public get autoRegister(): AbstractControl | null {
    return this.formGroup.get('autoRegister');
  }

  public get idpDisplayNameMapping(): AbstractControl | null {
    return this.formGroup.get('idpDisplayNameMapping');
  }

  public get usernameMapping(): AbstractControl | null {
    return this.formGroup.get('usernameMapping');
  }
}
