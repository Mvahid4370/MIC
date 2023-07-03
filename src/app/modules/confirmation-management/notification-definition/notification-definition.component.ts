import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  // AdvertisementGroup,
  // AdvertisementType,
  AssetAttachment,
  CourseLengths,
  Report,
  UrlBuilder,
  CreateOnlineAdvertDefinition,
  OnlineAdvertAttachmentNeeds,
  Publisher,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import { MessageService } from 'primeng/api';
import { of, tap } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'marketwatch-notification-definition',
  templateUrl: './notification-definition.component.html',
  styleUrls: ['./notification-definition.component.scss'],
})
export class NotificationDefinitionComponent implements OnInit {
  /*--------------------------
  # AdvertisementGroup
  --------------------------*/
  /** گروه اطلاعیه */
  // advertisementGroups: AdvertisementGroup[] = [];
  /** گروه اطلاعیه انتخاب شده */
  // selectedAdvertisementGroup = new AdvertisementGroup();

  /*--------------------------
  # AdvertisementGroup
  --------------------------*/
  /** نوع اطلاعیه */
  // advertisementTypes: AdvertisementType[] = [];
  /** نوع  اطلاعیه انتخاب شده */
  // selectedAdvertisementType = new AdvertisementType();

  /*--------------------------
  # CourseLengths
  --------------------------*/
  /** طول دوره */
  courseLengths: CourseLengths[] = [];
  /** طول  دوره انتخاب شده */
  selectedCourseLength = new CourseLengths();

  /*--------------------------
  # Upload
  --------------------------*/
  /** موضوع اطلاعیه */
  notificationSubject = '';

  /** سال مالی منتهی به */
  endDate!: JDate;

  /** حسابرسی شده */
  hasAudit = true;

  multimediaIdList: number[] = [];

  visible = false;

  selectedOnlineAdvert: any;

  totalCount!: number;

  /** Main table data. */
  onlineAdvertAttachNeeds: any;

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  /*--------------------------
  # Form
  --------------------------*/
  addNewReportForm!: FormGroup;
  addNewFormModel = new Report();
  addNewFormLoading = false;
  addNewFormSubmitted = false;

  get description() {
    return this.addNewReportForm.get('description');
  }
  get courseLength() {
    return this.addNewReportForm.get('courseLength');
  }
  get yearEnding() {
    return this.addNewReportForm.get('yearEnding');
  }
  // get advertisementGroup() {
  //   return this.addNewReportForm.get('advertisementGroup');
  // }
  get advertisementType() {
    return this.addNewReportForm.get('advertisementType');
  }
  get audited() {
    return this.addNewReportForm.get('audited');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService,
    private fileUpload: FileUpload
  ) {}

  ngOnInit(): void {
    this.addNewReportForm = new FormGroup({
      description: new FormControl(
        this.addNewFormModel.description,
        Validators.required
      ),
      yearEnding: new FormControl(
        this.addNewFormModel.yearEnding,
        Validators.required
      ),
      // advertisementGroup: new FormControl(
      //   this.addNewFormModel.advertisementGroup,
      //   Validators.required
      // ),
      advertisementType: new FormControl(
        { value: this.addNewFormModel.advertisementType, disabled: true },
        Validators.required
      ),
      courseLength: new FormControl(this.addNewFormModel.courseLength),
      audited: new FormControl(this.addNewFormModel.audited),
    });

    // this.getAdvertisementGroups();
    // this.getAdvertisementTypes(0);
    // this.getCompanyInspectionInstitutes();
    this.courseLengths = [
      { title: '\u06F1', id: 1 },
      { title: '\u06F3', id: 3 },
      { title: '\u06F6', id: 6 },
      { title: '\u06F9', id: 9 },
      { title: '\u06F1\u06F2', id: 12 },
    ];
  }

  /*--------------------------
  # ActivityType
  --------------------------*/
  // getAdvertisementGroups() {
  //   this.httpService
  //     .get<AdvertisementGroup[]>(AdvertisementGroup.apiAddress)
  //     .subscribe(response => {
  //       if (response.data.result) {
  //         this.advertisementGroups = response.data.result;
  //       }
  //     });
  // }

  /*--------------------------
  # AdvertisementType
  --------------------------*/
  // getAdvertisementTypes(groupId: number) {
  //   this.httpService
  //     .get<AdvertisementType[]>(AdvertisementType.apiAddress + '/' + groupId)
  //     .subscribe(response => {
  //       if (response.data.result) {
  //         this.advertisementTypes = response.data.result;
  //       }
  //     });
  // }

  // onChangeAdverGroup() {
  //   const { advertisementGroup } = this.addNewReportForm.value;
  //   this.getAdvertisementTypes(advertisementGroup?.id);
  // }

  /*--------------------------
  # Upload
  --------------------------*/

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
          rowData.onlineAdvertAttachmentNeedsId
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

  /*--------------------------
  # Form
  --------------------------*/
  addNewReport() {
    this.addNewFormSubmitted = true;

    if (this.addNewReportForm.valid) {
      const {
        description,
        yearEnding,
        // advertisementGroup,
        // advertisementType,
        courseLength,
        audited,
      } = this.addNewReportForm.value;

      const request = new Report();
      request.subject = description;
      request.description = description;
      request.audited = audited;
      // request.advertisementGroupId = advertisementGroup?.id;
      // request.advertisementTypeId = advertisementType?.id;
      request.onlineAdvertDefinitionId = this.selectedOnlineAdvert?.id;
      request.courseLength = courseLength?.id;
      request.yearEnding = this.jDateCalculatorService.convertToGeorgian(
        yearEnding?.getFullYear(),
        yearEnding?.getMonth(),
        yearEnding?.getDate()
      );
      request.multiMediaIds = this.multimediaIdList;

      this.addNewFormLoading = true;

      this.httpService
        .post<Report[]>(
          UrlBuilder.build(Publisher.apiAddress + '/AddAdvert', ''),
          request
        )
        .pipe(tap(() => (this.addNewFormLoading = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'notificationDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعیه`,
              summary: 'با موفقیت تعریف شد',
            });

            this.resetAddNewReportForm();
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
  }

  resetAddNewReportForm() {
    this.addNewReportForm.reset();
    this.addNewFormSubmitted = false;
    this.addNewReportForm.patchValue({
      audited: false,
    });
  }

  onOpenTypesList() {
    this.visible = true;
  }

  onHide(event: any) {
    this.visible = false;
    this.selectedOnlineAdvert = event;

    this.addNewReportForm.patchValue({
      advertisementType: event?.advertisementTypeName,
    });

    this.getOnlineAdvertisment(event.id);
  }

  getOnlineAdvertisment(Id: number) {
    this.loading = true;
    this.httpService
      .get<OnlineAdvertAttachmentNeeds[]>(
        OnlineAdvertAttachmentNeeds.apiAddress + `/list/${Id}`
      )
      .pipe(tap(() => (this.loading = false)))
      .subscribe(onlineAdvertAttachNeeds => {
        this.onlineAdvertAttachNeeds = onlineAdvertAttachNeeds.data.result;
      });
  }
}
