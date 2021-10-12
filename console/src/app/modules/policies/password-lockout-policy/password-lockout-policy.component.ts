import { Component, Injector, Input, OnDestroy, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GetLockoutPolicyResponse as AdminGetPasswordLockoutPolicyResponse } from 'src/app/proto/generated/zitadel/admin_pb';
import { GetLockoutPolicyResponse as MgmtGetPasswordLockoutPolicyResponse } from 'src/app/proto/generated/zitadel/management_pb';
import { LockoutPolicy } from 'src/app/proto/generated/zitadel/policy_pb';
import { AdminService } from 'src/app/services/admin.service';
import { ManagementService } from 'src/app/services/mgmt.service';
import { ToastService } from 'src/app/services/toast.service';

import { InfoSectionType } from '../../info-section/info-section.component';
import { PolicyComponentServiceType } from '../policy-component-types.enum';

@Component({
  selector: 'cnsl-password-lockout-policy',
  templateUrl: './password-lockout-policy.component.html',
  styleUrls: ['./password-lockout-policy.component.scss'],
})
export class PasswordLockoutPolicyComponent implements OnDestroy {
  @Input() public service!: ManagementService | AdminService;
  public serviceType: PolicyComponentServiceType = PolicyComponentServiceType.MGMT;

  public lockoutForm!: FormGroup;
  public lockoutData!: LockoutPolicy.AsObject;
  private sub: Subscription = new Subscription();
  public PolicyComponentServiceType: any = PolicyComponentServiceType;
  public InfoSectionType: any = InfoSectionType;

  constructor(private route: ActivatedRoute, private toast: ToastService, private injector: Injector) {
    this.sub = this.route.data
      .pipe(
        switchMap((data) => {
          this.serviceType = data.serviceType;

          switch (this.serviceType) {
            case PolicyComponentServiceType.MGMT:
              this.service = this.injector.get(ManagementService as Type<ManagementService>);
              break;
            case PolicyComponentServiceType.ADMIN:
              this.service = this.injector.get(AdminService as Type<AdminService>);
              break;
          }

          return this.route.params;
        }),
      )
      .subscribe(() => {
        this.fetchData();
      });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private fetchData(): void {
    this.getData().then((resp) => {
      if (resp.policy) {
        this.lockoutData = resp.policy;
      }
    });
  }

  private getData(): Promise<
    AdminGetPasswordLockoutPolicyResponse.AsObject | MgmtGetPasswordLockoutPolicyResponse.AsObject
  > {
    switch (this.serviceType) {
      case PolicyComponentServiceType.MGMT:
        return (this.service as ManagementService).getLockoutPolicy();
      case PolicyComponentServiceType.ADMIN:
        return (this.service as AdminService).getLockoutPolicy();
    }
  }

  public resetPolicy(): void {
    if (this.service instanceof ManagementService) {
      this.service
        .resetLockoutPolicyToDefault()
        .then(() => {
          this.toast.showInfo('POLICY.TOAST.RESETSUCCESS', true);
          this.fetchData();
        })
        .catch((error) => {
          this.toast.showError(error);
        });
    }
  }

  public incrementMaxAttempts(): void {
    if (this.lockoutData?.maxPasswordAttempts !== undefined) {
      this.lockoutData.maxPasswordAttempts++;
    }
  }

  public decrementMaxAttempts(): void {
    if (this.lockoutData?.maxPasswordAttempts && this.lockoutData?.maxPasswordAttempts > 0) {
      this.lockoutData.maxPasswordAttempts--;
    }
  }

  public savePolicy(): void {
    let promise: Promise<any>;
    if (this.service instanceof AdminService) {
      promise = this.service
        .updateLockoutPolicy(this.lockoutData.maxPasswordAttempts)
        .then(() => {
          this.toast.showInfo('POLICY.TOAST.SET', true);
          this.fetchData();
        })
        .catch((error) => {
          this.toast.showError(error);
        });
    } else {
      if ((this.lockoutData as LockoutPolicy.AsObject).isDefault) {
        promise = this.service
          .addCustomLockoutPolicy(this.lockoutData.maxPasswordAttempts)
          .then(() => {
            this.toast.showInfo('POLICY.TOAST.SET', true);
            this.fetchData();
          })
          .catch((error) => {
            this.toast.showError(error);
          });
      } else {
        promise = this.service
          .updateCustomLockoutPolicy(this.lockoutData.maxPasswordAttempts)
          .then(() => {
            this.toast.showInfo('POLICY.TOAST.SET', true);
            this.fetchData();
          })
          .catch((error) => {
            this.toast.showError(error);
          });
      }
    }
  }

  public get isDefault(): boolean {
    if (this.lockoutData && this.serviceType === PolicyComponentServiceType.MGMT) {
      return (this.lockoutData as LockoutPolicy.AsObject).isDefault;
    } else {
      return false;
    }
  }
}
