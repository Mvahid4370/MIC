/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Asset,
  Attachments,
  AttachmentsType,
  Report,
  ReportAttachment,
  Supervisor,
  SupervisorSearch,
  UrlBuilder,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-confirmation-definition',
  templateUrl: './confirmation-definition.component.html',
  styleUrls: ['./confirmation-definition.component.scss'],
})
export class ConfirmationDefinitionComponent implements OnInit {
  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  reportList: Report[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  /*--------------------------
  # SEARCH
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  searchReportForm!: FormGroup;

  /** مدل جستجو کاربر */
  searchReportModel = new Report();

  /** نام شرکت */
  get company() {
    return this.searchReportForm.get('company');
  }
  /** عنوان اطلاعیه */
  get description() {
    return this.searchReportForm.get('description');
  }
  /** کد */
  get code() {
    return this.searchReportForm.get('code');
  }
  /** زمان ارسال */
  get sendDate() {
    return this.searchReportForm.get('sendDate');
  }

  /*--------------------------
  # REJECT
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  rejectReportForm!: FormGroup;

  /** مدل جستجو کاربر */
  rejectReportModel: { reason: string } = { reason: '' };

  /** نام شرکت */
  get reason() {
    return this.rejectReportForm.get('reason');
  }

  rejectReportFormSubmitted = false;
  /*--------------------------
  # DETAILS
  --------------------------*/
  /** Preview details state. */
  previewDetailsDialog = false;

  /** Selected report model */
  selectedReport = new Report();

  /*--------------------------
  # ATTACHMENT
  --------------------------*/
  /** Preview attachments state. */
  previewAttachmentsDialog = false;

  /** Preview attachments state. */
  previewAttachmentsLoading = false;

  /** Preview attachments state. */
  reportAttachment!: ReportAttachment;

  /** Attachment types */
  attachmentType = AttachmentsType;

  /*--------------------------
  # CONFIRMATION
  --------------------------*/
  /** Preview details state. */
  previewConfirmationDialog = false;

  /** confirmation state */
  actionType: any;

  /** Rejection reason */
  rejectedReason!: string;

  gridClass = 'p-datatable-sm';

  constructor(
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.searchReportForm = new FormGroup({
      company: new FormControl(this.searchReportModel.company),
      description: new FormControl(this.searchReportModel.description),
      code: new FormControl(this.searchReportModel.code),
      sendDate: new FormControl(this.searchReportModel.sendDate),
    });

    this.rejectReportForm = new FormGroup({
      reason: new FormControl(this.rejectReportModel.reason),
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
  getReportList(event?: LazyLoadEvent, searchModel = new Report()) {
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;

    this.loading = true;

    this.httpService
      .get<SupervisorSearch[]>(
        SupervisorSearch.apiAddress + '/list',
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
    if (this.searchReportForm.valid) {
      const { company, searchLastName, code, sendDate } =
        this.searchReportForm.value;

      const searchModel = new Report();

      searchModel.companyName = company;

      searchModel.description = searchLastName;

      searchModel.code = Number(PersianNumberService.toEnglish(code));

      searchModel.sendDate =
        sendDate &&
        this.jDateCalculatorService.convertToGeorgian(
          sendDate?.getFullYear(),
          sendDate?.getMonth(),
          sendDate?.getDate()
        );

      this.getReportList({}, searchModel);
    }
  }

  /*--------------------------
  # DETAILS
  --------------------------*/
  /**
   * Show report details modal.
   * @param report report details model
   */
  previewDetails(report: Report) {
    this.selectedReport = report;
    this.previewDetailsDialog = true;
  }

  /*--------------------------
  # ATTACHMENT
  --------------------------*/
  /** Preview report attchmnets
   * @param id report id
   */
  previewAttachments(id: number) {
    if (id) {
      this.previewAttachmentsLoading = true;

      this.httpService
        .get<ReportAttachment>(
          UrlBuilder.build(Report.apiAddress + '/' + id, 'ATTACHMENTS')
        )
        .pipe(
          tap(() => (this.previewAttachmentsLoading = false)),
          map(response => {
            if (response.data && response.data.result)
              return response.data.result;
            else return new ReportAttachment();
          })
        )
        .subscribe(reportAttachment => {
          this.reportAttachment = reportAttachment;
          this.previewAttachmentsDialog = true;
        });
    }
  }

  /**
   * Download report attchment.
   * @param id attachment id
   */
  downloadAttachmnet(attachment: Attachments) {
    if (attachment.id) {
      this.httpService
        .getFile(
          UrlBuilder.build(Asset.apiAddress + `/${attachment.id}`, 'DOWNLOAD')
        )
        .subscribe(reponse =>
          this.downLoadFile(reponse, attachment.mimeType, attachment.fileName)
        );
    }
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: Blob, type: string, fileName: string) {
    const blob = new Blob([data], { type: type.toString() });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }

  /*--------------------------
  # CONFIRMATION
  --------------------------*/
  /** Preview report attchmnets
   * @param id report id
   */
  previewConfirmation(report: Report) {
    this.selectedReport = report;
    this.previewConfirmationDialog = true;
  }

  // /**
  //  * Approve report.
  //  * @param id report id
  //  */
  // approveReport(rowData: SupervisorSearch) {
  //   const body = {
  //     advertId: rowData.advertId,
  //     workFlowId: rowData.id,
  //     comment: this.rejectReportForm.get('reason')?.value,
  //   };
  //   this.httpService
  //     .post<SupervisorSearch>(
  //       UrlBuilder.build(SupervisorSearch.apiAddress, 'APPROVE'),
  //       body
  //     )
  //     .subscribe(response => {
  //       if (response.successed) {
  //         this.previewConfirmationDialog = false;

  //         this.messageService.add({
  //           key: 'confirmationDefinition',
  //           life: 8000,
  //           severity: 'success',
  //           detail: `تایید اطلاعیه`,
  //           summary: 'با موفقیت انجام شد',
  //         });
  //       }
  //     });
  // }

  // /**
  //  * reject report.
  //  * @param id report id
  //  */
  // rejectReport(rowData: SupervisorSearch) {
  //   if (rowData.id) {
  //     this.rejectReportFormSubmitted = true;

  //     this.rejectReportForm.get('reason')?.setValidators(Validators.required);
  //     this.rejectReportForm.get('reason')?.updateValueAndValidity();

  //     const body = {
  //       advertId: rowData.advertId,
  //       workFlowId: rowData.id,
  //       comment: this.rejectReportForm.get('reason')?.value,
  //     };

  //     if (this.rejectReportForm.valid)
  //       this.httpService
  //         .post<SupervisorSearch>(
  //           UrlBuilder.build(SupervisorSearch.apiAddress, 'REJECT'),
  //           body
  //         )
  //         .pipe(
  //           tap(() => (this.loading = false)),
  //           map(response => {
  //             if (response.data && response.data.result)
  //               return response.data.result;
  //             else return [];
  //           })
  //         )
  //         .subscribe(response => {
  //           this.previewConfirmationDialog = false;

  //           if (response.succeeded)
  //             this.messageService.add({
  //               key: 'confirmationDefinition',
  //               life: 8000,
  //               severity: 'success',
  //               detail: `عدم تایید اطلاعیه`,
  //               summary: 'با موفقیت انجام شد',
  //             });
  //         });
  //   }
  // }

  confirmReport() {
    const body = {
      advertId: this.selectedReport.advertId,
      workFlowId: this.selectedReport.id,
      comment: this.rejectReportForm.get('reason')?.value,
    };
    this.httpService
      .post<SupervisorSearch>(
        UrlBuilder.build(SupervisorSearch.apiAddress, this.actionType),
        body
      )
      .subscribe(response => {
        if (response.successed) {
          this.previewConfirmationDialog = false;

          this.messageService.add({
            key: 'confirmationDefinition',
            life: 8000,
            severity: 'success',
            // detail: `تایید اطلاعیه`,
            summary: 'عملیات با موفقیت انجام شد',
          });
        }
      });
  }

  closeConfirmationDialog() {
    this.previewConfirmationDialog = false;
    this.rejectedReason = '';
  }
}
