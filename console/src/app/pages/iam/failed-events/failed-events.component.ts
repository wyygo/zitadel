import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { FailedEvent } from 'src/app/proto/generated/zitadel/admin_pb';
import { AdminService } from 'src/app/services/admin.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'cnsl-iam-failed-events',
  templateUrl: './failed-events.component.html',
  styleUrls: ['./failed-events.component.scss'],
})
export class FailedEventsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) public eventPaginator!: MatPaginator;
  public eventDataSource!: MatTableDataSource<FailedEvent.AsObject>;

  public eventDisplayedColumns: string[] = [
    'viewName',
    'database',
    'failedSequence',
    'failureCount',
    'errorMessage',
    'actions',
  ];

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  constructor(private adminService: AdminService, private toast: ToastService) {
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  public loadEvents(): void {
    this.loadingSubject.next(true);
    from(this.adminService.listFailedEvents())
      .pipe(
        map((resp) => {
          return resp?.resultList;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((views) => {
        this.eventDataSource = new MatTableDataSource(views);
        this.eventDataSource.paginator = this.eventPaginator;
      });
  }

  public cancelEvent(viewname: string, db: string, seq: number): void {
    this.adminService.removeFailedEvent(viewname, db, seq).then(() => {
      this.toast.showInfo('IAM.FAILEDEVENTS.DELETESUCCESS', true);
    });
  }
}
