import { DataSource } from '@angular/cdk/collections';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Membership } from 'src/app/proto/generated/zitadel/user_pb';
import { GrpcAuthService } from 'src/app/services/grpc-auth.service';
import { ManagementService } from 'src/app/services/mgmt.service';

export class MembershipDetailDataSource extends DataSource<Membership.AsObject> {
  public totalResult: number = 0;
  public viewTimestamp!: Timestamp.AsObject;
  public membersSubject: BehaviorSubject<Membership.AsObject[]> = new BehaviorSubject<Membership.AsObject[]>([]);
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private mgmtUserService: ManagementService, private authServce: GrpcAuthService) {
    super();
  }

  public loadMemberships(userId: string, pageIndex: number, pageSize: number): void {
    const offset = pageIndex * pageSize;

    this.loadingSubject.next(true);
    from(this.mgmtUserService.listUserMemberships(userId, pageSize, offset))
      .pipe(
        map((resp) => {
          this.totalResult = resp.details?.totalResult || 0;
          if (resp.details?.viewTimestamp) {
            this.viewTimestamp = resp.details.viewTimestamp;
          }
          return resp.resultList;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((members) => {
        this.membersSubject.next(members);
      });
  }

  public loadMyMemberships(pageIndex: number, pageSize: number): void {
    const offset = pageIndex * pageSize;

    this.loadingSubject.next(true);
    from(this.authServce.listMyMemberships(pageSize, offset))
      .pipe(
        map((resp) => {
          this.totalResult = resp.details?.totalResult || 0;
          if (resp.details?.viewTimestamp) {
            this.viewTimestamp = resp.details.viewTimestamp;
          }
          return resp.resultList;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((members) => {
        this.membersSubject.next(members);
      });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  public connect(): Observable<Membership.AsObject[]> {
    return this.membersSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  public disconnect(): void {
    this.membersSubject.complete();
    this.loadingSubject.complete();
  }
}
