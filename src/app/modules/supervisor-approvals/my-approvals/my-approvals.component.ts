import { Component } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Report, SupervisorSearch } from '@shared/models/response.model';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-my-approvals',
  templateUrl: './my-approvals.component.html',
  styleUrls: ['./my-approvals.component.scss'],
  providers: [ConfirmationService],
})
export class MyApprovalsComponent {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  myApprovalsLst: Report[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  constructor(private httpService: HttpService) {}

  /*--------------------------
  # Data
  --------------------------*/
  /** Get myApprovalsLst from server. */
  getMyConfirms(event?: LazyLoadEvent, searchModel = new Report()) {
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;
    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;
    this.loading = true;

    this.httpService
      .post<Report[]>(SupervisorSearch.apiAddress + '/myConfirms', searchModel)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return;
        })
      )
      .subscribe(myApprovalsLst => {
        if (myApprovalsLst) this.myApprovalsLst = myApprovalsLst;
      });
  }
}
