import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { PaginatorComponent } from 'src/app/modules/paginator/paginator.component';
import { GrantedProject, Role } from 'src/app/proto/generated/zitadel/project_pb';
import { ManagementService } from 'src/app/services/mgmt.service';
import { ToastService } from 'src/app/services/toast.service';

import { ProjectGrantsDataSource } from './project-grants-datasource';

@Component({
  selector: 'cnsl-project-grants',
  templateUrl: './project-grants.component.html',
  styleUrls: ['./project-grants.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectGrantsComponent implements OnInit, AfterViewInit {
  @Input() refreshOnPreviousRoutes: string[] = [];
  @Input() public projectId: string = '';
  @Input() public disabled: boolean = false;
  @ViewChild(PaginatorComponent) public paginator!: PaginatorComponent;
  @ViewChild(MatTable) public table!: MatTable<GrantedProject.AsObject>;
  public dataSource!: ProjectGrantsDataSource;
  public selection: SelectionModel<GrantedProject.AsObject> = new SelectionModel<GrantedProject.AsObject>(true, []);
  public memberRoleOptions: Role.AsObject[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns: string[] = ['select', 'grantedOrgName', 'dates'];

  constructor(private mgmtService: ManagementService, private toast: ToastService) {}

  public ngOnInit(): void {
    this.dataSource = new ProjectGrantsDataSource(this.mgmtService);
    this.dataSource.loadGrants(this.projectId, 0, 25, 'asc');
    this.getRoleOptions(this.projectId);
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadGrantsPage())).subscribe();
  }

  public loadGrantsPage(pageIndex?: number, pageSize?: number): void {
    this.dataSource.loadGrants(this.projectId, pageIndex ?? this.paginator.pageIndex, pageSize ?? this.paginator.pageSize);
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.grantsSubject.value.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.grantsSubject.value.forEach((row) => this.selection.select(row));
  }

  public getRoleOptions(projectId: string): void {
    this.mgmtService.listProjectRoles(projectId, 100, 0).then((resp) => {
      this.memberRoleOptions = resp.resultList;
    });
  }

  updateRoles(grant: GrantedProject.AsObject, selectionChange: MatSelectChange): void {
    this.mgmtService
      .updateProjectGrant(grant.grantId, grant.projectId, selectionChange.value)
      .then(() => {
        this.toast.showInfo('PROJECT.GRANT.TOAST.PROJECTGRANTCHANGED', true);
      })
      .catch((error) => {
        this.toast.showError(error);
      });
  }

  deleteSelectedGrants(): void {
    const promises = this.selection.selected.map((grant) => {
      return this.mgmtService.removeProjectGrant(grant.grantId, grant.projectId);
    });

    Promise.all(promises)
      .then(() => {
        this.toast.showInfo('GRANTS.TOAST.BULKREMOVED', true);
        const data = this.dataSource.grantsSubject.getValue();
        this.selection.selected.forEach((item) => {
          const index = data.findIndex((i) => i.grantId === item.grantId);
          if (index > -1) {
            data.splice(index, 1);
            this.dataSource.grantsSubject.next(data);
          }
        });
        this.selection.clear();
      })
      .catch((error) => {
        this.toast.showError(error);
      });
  }
}
