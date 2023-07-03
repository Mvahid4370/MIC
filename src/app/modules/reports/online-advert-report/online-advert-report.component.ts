import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  AdvertismentType,
  SystemReports,
  UrlBuilder,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-online-advert-report',
  templateUrl: './online-advert-report.component.html',
  styleUrls: ['./online-advert-report.component.scss'],
})
export class OnlineAdvertReportComponent implements OnInit {
  advertismentTypes: AdvertismentType[] = [];
  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  reportList: SystemReports[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  /*--------------------------
  # SEARCH
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  OnlineAdvertReportForm!: FormGroup;

  /** مدل جستجو کاربر */
  searchReportModel = new SystemReports();

  // /** نام شرکت */
  // get company() {
  //   return this.OnlineAdvertReportForm.get('company');
  // }
  // /** عنوان اطلاعیه */
  // get description() {
  //   return this.OnlineAdvertReportForm.get('description');
  // }
  // /** کد */
  // get code() {
  //   return this.OnlineAdvertReportForm.get('code');
  // }
  // /** زمان ارسال */
  // get sendDate() {
  //   return this.OnlineAdvertReportForm.get('sendDate');
  // }

  // /*--------------------------
  // # REJECT
  // --------------------------*/
  // /** گروه فرم جستجو کاربر */
  // rejectReportForm!: FormGroup;

  // /** مدل جستجو کاربر */
  // rejectReportModel: { reason: string } = { reason: '' };

  // /** نام شرکت */
  // get reason() {
  //   return this.rejectReportForm.get('reason');
  // }

  gridClass = 'p-datatable-sm';

  constructor(
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAdvertismentTypes();
    this.OnlineAdvertReportForm = new FormGroup({
      advertisementTypeId: new FormControl(
        this.searchReportModel.advertisementTypeId
      ),
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
  getReportList(event?: LazyLoadEvent, searchModel = new SystemReports()) {
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<SystemReports[]>(
        SystemReports.apiAddress + '/OnlineAdvertReport',
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
    const { advertisementTypeId, toDate, fromDate } =
      this.OnlineAdvertReportForm.value;

    const searchModel = new SystemReports();

    searchModel.advertisementTypeId = advertisementTypeId?.key;

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

  getAdvertismentTypes() {
    this.loading = true;
    this.httpService
      .get<AdvertismentType[]>(
        UrlBuilder.build(AdvertismentType.apiAddress, 'TREE')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new AdvertismentType()];
        })
      )
      .subscribe(
        advertismentTypes => (this.advertismentTypes = advertismentTypes)
      );
  }
}
