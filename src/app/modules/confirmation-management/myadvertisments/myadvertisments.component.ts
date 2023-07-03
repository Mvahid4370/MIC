/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import {
  Asset,
  AssetAttachment,
  Attachments,
  AttachmentsType,
  BaseResponse,
  OnlineAdvertAttachmentNeeds,
  Publisher,
  Report,
  ReportAttachment,
  UrlBuilder,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { map, of, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-myadvertisments',
  templateUrl: './myadvertisments.component.html',
  styleUrls: ['./myadvertisments.component.scss'],
})
export class MyadvertismentsComponent implements OnInit {
  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  reportList: Report[] = [];

  /** Main table loading. */
  loading = false;
  onlineAdvertismentLoading = false;

  /** Main table rows */
  dataTableRows = 15;

  gridClass = 'p-datatable-sm';

  onlineAdvertAttachNeeds: any;

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
  addAmendmentForm!: FormGroup;

  addAmendmentModel: { reason: string } = { reason: '' };

  /** نام شرکت */
  get reason() {
    return this.addAmendmentForm.get('reason');
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
  isConfirmed = false;

  /** Rejection reason */
  rejectedReason!: string;

  multimediaIdList: number[] = [];

  addAmendmentLoading = false;

  constructor(
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService,
    private messageService: MessageService,
    private config: AppConfigService
  ) {}

  ngOnInit(): void {
    this.searchReportForm = new FormGroup({
      company: new FormControl(this.searchReportModel.company),
      description: new FormControl(this.searchReportModel.description),
      code: new FormControl(this.searchReportModel.code),
      sendDate: new FormControl(this.searchReportModel.sendDate),
    });

    this.addAmendmentForm = new FormGroup({
      reason: new FormControl(this.addAmendmentModel.reason),
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
  getReportList(event?: LazyLoadEvent, searchModel = new Publisher()) {
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Publisher[]>(Publisher.apiAddress + '/search', searchModel)
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
  serachReport() {
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
    this.getOnlineAdvertisment(report.onlineAdvertDefinitionId);
    this.selectedReport = report;
    this.previewConfirmationDialog = true;
  }

  addAmendment(reportId: number) {
    const { reason } = this.addAmendmentForm.value;

    this.addAmendmentLoading = true;
    const request = {
      advertId: reportId,
      amendmentReason: reason,
      multiMediaIds: this.multimediaIdList,
    };
    const url = '/Publisher/ResendAdvert';

    this.httpService
      .post<Report[]>(
        UrlBuilder.build(Publisher.apiAddress + '/ResendAdvert', ''),
        {
          advertId: reportId,
          amendmentReason: reason,
          multiMediaIds: this.multimediaIdList,
        }
      )
      .pipe(tap(() => (this.addAmendmentLoading = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'myAdvertisments',
            life: 8000,
            severity: 'success',
            detail: `اصلاحیه`,
            summary: 'با موفقیت ثبت شد',
          });

          this.closeConfirmationDialog();
          this.multimediaIdList = [];
          const x = document.getElementsByTagName('p-fileupload');
          for (let i = 0; x.length > i; i++) {
            const el_label = x[i]?.getElementsByClassName('p-button-label');
            el_label
              ? (el_label[0].textContent = 'افزودن پیوست')
              : 'تغییر پیوست';
          }
        }
      });
  }

  closeConfirmationDialog() {
    this.previewConfirmationDialog = false;
    this.rejectedReason = '';
  }

  /*--------------------------
  # Upload
  --------------------------*/
  // uploadAttachment(files: FileList) {
  //   if (files.length) {
  //     Array.from(files).forEach(file => {
  //       const data = new FormData();
  //       data.append('File', file);

  //       if (file.size <= 10000000)
  //         return this.httpService
  //           .post<AssetAttachment>(AssetAttachment.apiAddress, data)
  //           .subscribe(response => {
  //             if (response.successed && response.data && response.data.result) {
  //               this.messageService.add({
  //                 key: 'notificationDefinition',
  //                 life: 8000,
  //                 severity: 'success',
  //                 detail: 'رسانه',
  //                 summary: 'با موفقیت بارگزاری شد',
  //               });

  //               this.multimediaIdList.push(response.data.result.multiMediaId);
  //             }
  //           });
  //       else return of();
  //     });
  //   }
  // }

  getOnlineAdvertisment(Id: any) {
    this.onlineAdvertismentLoading = true;
    this.httpService
      .get<OnlineAdvertAttachmentNeeds[]>(
        OnlineAdvertAttachmentNeeds.apiAddress + `/list/${Id}`
      )
      .pipe(tap(() => (this.onlineAdvertismentLoading = false)))
      .subscribe(onlineAdvertAttachNeeds => {
        this.onlineAdvertAttachNeeds = onlineAdvertAttachNeeds.data.result;
      });
  }

  onSelectAttachment(files: FileList, data: any, form: any) {
    const splt = files[0].name.split('.');
    if (splt[1] == data.extention) this.uploadAttachment(files, data);
    else {
      this.messageService.add({
        key: 'notificationDefinition',
        life: 8000,
        severity: 'error',
        detail: '',
        summary: 'فرمت فایل ارسالی صحیح نمیباشد',
      });
    }
    form.clear();
  }

  uploadAttachment(files: FileList, rowData: any) {
    if (files.length) {
      Array.from(files).forEach(file => {
        // let inputData: any;
        const data = new FormData();
        data.append('File', file);
        data.append(
          'OnlineAdvertNeedsInfoId',
          this.selectedReport.onlineAdvertDefinitionId.toString()
        );

        // inputData.OnlineAdvertNeedsInfoId = this.selectedOnlineAdvert;

        if (file.size <= 10000000)
          return this.httpService
            .post<AssetAttachment>(AssetAttachment.apiAddress, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'notificationDefinition',
                  life: 8000,
                  severity: 'success',
                  detail: 'رسانه',
                  summary: 'با موفقیت بارگزاری شد',
                });

                this.multimediaIdList.push(response.data.result.multiMediaId);
                const el_fileUpload = document.getElementById(
                  'fileUpload_' + rowData.onlineAdvertAttachmentNeedsId
                );
                const el_label =
                  el_fileUpload?.getElementsByClassName('p-button-label');
                el_label
                  ? (el_label[0].textContent = 'تغییر پیوست')
                  : 'افزودن پیوست';
              }
            });
        else return of();
      });
    }
  }
}
