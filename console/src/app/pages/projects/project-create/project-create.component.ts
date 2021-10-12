import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddProjectRequest, AddProjectResponse } from 'src/app/proto/generated/zitadel/management_pb';
import { ManagementService } from 'src/app/services/mgmt.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'cnsl-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent {
  public project: AddProjectRequest.AsObject = new AddProjectRequest().toObject();

  constructor(
    private router: Router,
    private toast: ToastService,
    private mgmtService: ManagementService,
    private _location: Location,
  ) {}

  public createSteps: number = 1;
  public currentCreateStep: number = 1;

  public saveProject(): void {
    this.mgmtService
      .addProject(this.project)
      .then((resp: AddProjectResponse.AsObject) => {
        this.router.navigate(['projects', resp.id]);
      })
      .catch((error) => {
        this.toast.showError(error);
      });
  }

  public close(): void {
    this._location.back();
  }
}
