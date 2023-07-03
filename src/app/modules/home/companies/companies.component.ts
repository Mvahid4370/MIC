/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  ListCompany,
  Pagination,
} from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent {
  /*--------------------------
  # Table
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  companyList: Company[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  companyName!: string;

  selectedCompany = new Company();

  previewDetailsDialog = false;

  gridClass = 'p-datatable-sm';

  constructor(private httpService: HttpService) {}

  /*--------------------------
  # GET
  --------------------------*/
  getCompanyList(event: LazyLoadEvent, companyName: string) {
    const pagination = new Pagination();
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Company[]>(ListCompany.apiAddress, {
        companyName: companyName,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      })
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (
            response.data &&
            response.data.result &&
            response.data.totalCount
          ) {
            this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Company()];
        })
      )
      .subscribe(companyList => (this.companyList = companyList));
  }

  /*--------------------------
  # DETAILS
  --------------------------*/
  /**
   * Show report details modal.
   * @param report report details model
   */
  previewDetails(company: Company) {
    this.selectedCompany = company;
    this.previewDetailsDialog = true;
  }
}
