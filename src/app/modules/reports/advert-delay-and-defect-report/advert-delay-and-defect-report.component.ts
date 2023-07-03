import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  AdvertDelayAndDefectReport,
  CompanyTree,
  CreateOnlineAdvertDefinition,
  UrlBuilder,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { LazyLoadEvent } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-advert-delay-and-defect-report',
  templateUrl: './advert-delay-and-defect-report.component.html',
  styleUrls: ['./advert-delay-and-defect-report.component.scss'],
})
export class AdvertDelayAndDefectReportComponent implements OnInit {
  onlineAdvertLst: any;
  /*--------------------------
  # Parents
  --------------------------*/
  parents: CompanyTree[] = [];

  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  reportList: AdvertDelayAndDefectReport[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  /*--------------------------
  # SEARCH
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  AdvertDelayAndDefectReportForm!: FormGroup;

  /** مدل جستجو کاربر */
  searchReportModel = new AdvertDelayAndDefectReport();

  gridClass = 'p-datatable-sm';

  isShowMenu = false;

  constructor(
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.getOnlineAdvert();
    this.getCompanyTree();
    this.AdvertDelayAndDefectReportForm = new FormGroup({
      onlineAdvertId: new FormControl(this.searchReportModel.onlineAdvertId),
      companyId: new FormControl(this.searchReportModel.companyId),
      toDate: new FormControl(this.searchReportModel.toDate),
      fromDate: new FormControl(this.searchReportModel.fromDate),
    });
  }

  /*--------------------------
  # TABLE
  --------------------------*/
  /**
   *  Get reports from server.
   * @param event primeNG lazy load event
   * @param searchModel search report model
   */
  getReportList(
    event?: LazyLoadEvent,
    searchModel = new AdvertDelayAndDefectReport()
  ) {
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<AdvertDelayAndDefectReport[]>(
        AdvertDelayAndDefectReport.apiAddress,
        searchModel
      )
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
          } else return [];
        })
      )
      .subscribe(reportList => (this.reportList = reportList));
  }

  /*--------------------------
  # SEARCH
  --------------------------*/
  /** Search reports. */
  searchReport() {
    const { onlineAdvertId, companyId, toDate, fromDate } =
      this.AdvertDelayAndDefectReportForm.value;

    const searchModel = new AdvertDelayAndDefectReport();

    searchModel.onlineAdvertId = onlineAdvertId;

    searchModel.companyId = companyId?.id;

    searchModel.fromDate =
      fromDate &&
      this.jDateCalculatorService.convertToGeorgian(
        fromDate?.getFullYear(),
        fromDate?.getMonth(),
        fromDate?.getDate()
      );

    searchModel.toDate =
      toDate &&
      this.jDateCalculatorService.convertToGeorgian(
        toDate?.getFullYear(),
        toDate?.getMonth(),
        toDate?.getDate()
      );

    this.getReportList({}, searchModel);
  }

  getOnlineAdvert() {
    const request = {};
    this.httpService
      .post<CreateOnlineAdvertDefinition>(
        UrlBuilder.build(CreateOnlineAdvertDefinition.apiAddress, 'LIST'),
        request
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return;
        })
      )
      .subscribe(advertismentTypes => {
        if (advertismentTypes) this.onlineAdvertLst = advertismentTypes;
      });
  }

  getCompanyTree() {
    this.httpService
      .get<CompanyTree[]>(CompanyTree.apiAddress)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return;
        })
      )
      .subscribe(permissions => {
        if (permissions) this.parents = permissions;
      });
  }

  getSttColor(color: string) {
    return 'background:' + color;
  }
}
