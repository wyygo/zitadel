import { animate, animateChild, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreationType, MemberCreateDialogComponent } from 'src/app/modules/add-member-dialog/member-create-dialog.component';
import { UserGrant } from 'src/app/proto/generated/zitadel/auth_pb';
import { Membership, User } from 'src/app/proto/generated/zitadel/user_pb';
import { AdminService } from 'src/app/services/admin.service';
import { GrpcAuthService } from 'src/app/services/grpc-auth.service';
import { ManagementService } from 'src/app/services/mgmt.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'cnsl-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [query('@animate', stagger('40ms', animateChild()), { optional: true })]),
    ]),
    trigger('animate', [
      transition(':enter', [
        animate(
          '.2s ease-in',
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, transform: 'scale(1.05)', offset: 0.3 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class MembershipsComponent implements OnInit {
  public loading: boolean = false;
  public memberships: Membership.AsObject[] = [];
  public totalResult: number = 0;

  @Input() public auth: boolean = false;
  @Input() public user!: User.AsObject;
  @Input() public disabled: boolean = false;

  constructor(
    private authService: GrpcAuthService,
    private mgmtService: ManagementService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadManager(this.user.id);
  }

  public async loadManager(userId: string): Promise<void> {
    if (this.auth) {
      this.authService.listMyMemberships(100, 0, []).then((resp) => {
        this.memberships = resp.resultList;
        this.totalResult = resp.details?.totalResult || 0;
        this.loading = false;
      });
    } else {
      this.mgmtService.listUserMemberships(userId, 100, 0, []).then((resp) => {
        this.memberships = resp.resultList;
        this.totalResult = resp.details?.totalResult || 0;
        this.loading = false;
      });
    }
  }

  public navigateToObject(): void {
    if (!this.disabled) {
      this.router.navigate(['/users', this.user.id, 'memberships']);
    }
  }

  public addMember(): void {
    const dialogRef = this.dialog.open(MemberCreateDialogComponent, {
      width: '400px',
      data: {
        user: this.user,
      },
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp && resp.creationType !== undefined) {
        switch (resp.creationType) {
          case CreationType.IAM:
            this.createIamMember(resp);
            break;
          case CreationType.ORG:
            this.createOrgMember(resp);
            break;
          case CreationType.PROJECT_OWNED:
            this.createOwnedProjectMember(resp);
            break;
          case CreationType.PROJECT_GRANTED:
            this.createGrantedProjectMember(resp);
            break;
        }
      }
    });
  }

  public createIamMember(response: any): void {
    const users: User.AsObject[] = response.users;
    const roles: string[] = response.roles;

    if (users && users.length && roles && roles.length) {
      Promise.all(
        users.map((user) => {
          return this.adminService.addIAMMember(user.id, roles);
        }),
      )
        .then(() => {
          this.toast.showInfo('IAM.TOAST.MEMBERADDED', true);
          setTimeout(() => {
            this.loadManager(this.user.id);
          }, 1000);
        })
        .catch((error) => {
          this.toast.showError(error);
        });
    }
  }

  private createOrgMember(response: any): void {
    const users: User.AsObject[] = response.users;
    const roles: string[] = response.roles;

    if (users && users.length && roles && roles.length) {
      Promise.all(
        users.map((user) => {
          return this.mgmtService.addOrgMember(user.id, roles);
        }),
      )
        .then(() => {
          this.toast.showInfo('ORG.TOAST.MEMBERADDED', true);
          setTimeout(() => {
            this.loadManager(this.user.id);
          }, 1000);
        })
        .catch((error) => {
          this.toast.showError(error);
        });
    }
  }

  private createGrantedProjectMember(response: any): void {
    const users: User.AsObject[] = response.users;
    const roles: string[] = response.roles;

    if (users && users.length && roles && roles.length) {
      users.forEach((user) => {
        return this.mgmtService
          .addProjectGrantMember(response.projectId, response.grantId, user.id, roles)
          .then(() => {
            this.toast.showInfo('PROJECT.TOAST.MEMBERADDED', true);
            setTimeout(() => {
              this.loadManager(this.user.id);
            }, 1000);
          })
          .catch((error) => {
            this.toast.showError(error);
          });
      });
    }
  }

  private createOwnedProjectMember(response: any): void {
    const users: User.AsObject[] = response.users;
    const roles: string[] = response.roles;

    if (users && users.length && roles && roles.length) {
      users.forEach((user) => {
        return this.mgmtService
          .addProjectMember(response.projectId, user.id, roles)
          .then(() => {
            this.toast.showInfo('PROJECT.TOAST.MEMBERADDED', true);
            setTimeout(() => {
              this.loadManager(this.user.id);
            }, 1000);
          })
          .catch((error) => {
            this.toast.showError(error);
          });
      });
    }
  }

  getColor(type: Membership.AsObject | UserGrant.AsObject): string {
    const gen = type.toString();
    const colors = ['rgb(201, 115, 88)', 'rgb(226, 176, 50)', 'rgb(112, 89, 152)'];

    let hash = 0;
    if (gen.length === 0) {
      return colors[hash];
    }
    for (let i = 0; i < gen.length; i++) {
      // eslint-disable-next-line no-bitwise
      hash = gen.charCodeAt(i) + ((hash << 5) - hash);
      // eslint-disable-next-line no-bitwise
      hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
  }
}
