/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import {
  AdvertisementGroup,
  AdvertisementType,
  Asset,
  Attachments,
  AttachmentsType,
  Company,
  CompanyInspectionInstitute,
  CompanyType,
  CourseLengths,
  PublisherStatus,
  Report,
  ReportAttachment,
  UrlBuilder,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
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

  /** Preview attachments state. */
  previewAttachmentsDialog = false;

  /** Preview attachments state. */
  previewAttachmentsLoading = false;

  /** Preview attachments state. */
  reportAttachment!: ReportAttachment;

  /** Attachment types */
  attachmentType = AttachmentsType;

  /** Preview details state. */
  previewDetailsDialog = false;

  /** Selected report model */
  selectedReport = new Report();

  /*--------------------------
  # PublisherStatus
  --------------------------*/
  publisherStatuses: PublisherStatus[] = [];

  /*--------------------------
  # AdvertisementGroup
  --------------------------*/
  /** گروه اطلاعیه */
  advertisementGroup: AdvertisementGroup[] = [];

  /*--------------------------
  # CompanyType
  --------------------------*/
  /** نوع‌های شرکت  */
  companyTypes: CompanyType[] = [];

  /*--------------------------
  # AdvertisementGroup
  --------------------------*/
  /** نوع اطلاعیه */
  advertisementTypes: AdvertisementType[] = [];

  /*--------------------------
  # companyInspectionInstitutes
  --------------------------*/
  /** موسسه حسابرسی شرکت */
  companyInspectionInstitutes: CompanyInspectionInstitute[] = [];

  /*--------------------------
  # CourseLengths
  --------------------------*/
  /** طول دوره */
  courseLengths: CourseLengths[] = [];

  /*--------------------------
  # CourseLengths
  --------------------------*/
  /** طول دوره */
  companies: Company[] = [];

  /*--------------------------
  # SEARCH
  --------------------------*/
  searchReportForm!: FormGroup;

  searchReportModel = new Report();

  searchReportSubmitted = false;

  gridClass = 'p-datatable-sm';

  get companyModel() {
    return this.searchReportForm.get('companyModel');
  }
  get publisherStatus() {
    return this.searchReportForm.get('publisherStatus');
  }
  get advertisementGroupModel() {
    return this.searchReportForm.get('advertisementGroupModel');
  }
  get companyType() {
    return this.searchReportForm.get('companyType');
  }
  get advertisementType() {
    return this.searchReportForm.get('advertisementType');
  }
  get description() {
    return this.searchReportForm.get('description');
  }
  get issueTrackingNo() {
    return this.searchReportForm.get('issueTrackingNo');
  }
  get code() {
    return this.searchReportForm.get('code');
  }
  get courseLength() {
    return this.searchReportForm.get('courseLength');
  }
  get companyInspectionInstituteModel() {
    return this.searchReportForm.get('companyInspectionInstituteModel');
  }
  get isAudited() {
    return this.searchReportForm.get('isAudited');
  }
  get isNotAudited() {
    return this.searchReportForm.get('isNotAudited');
  }
  get isRootAdvert() {
    return this.searchReportForm.get('isRootAdvert');
  }
  get isLeafAdvert() {
    return this.searchReportForm.get('isLeafAdvert');
  }
  get isRootCompany() {
    return this.searchReportForm.get('isRootCompany');
  }
  get isLeafCompany() {
    return this.searchReportForm.get('isLeafCompany');
  }
  get isHolding() {
    return this.searchReportForm.get('isHolding');
  }
  get fromPublishDate() {
    return this.searchReportForm.get('fromPublishDate');
  }
  get toPublishDate() {
    return this.searchReportForm.get('toPublishDate');
  }

  @ViewChild('dataTable') dataTable!: Table;

  constructor(
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.searchReportForm = new FormGroup({
      companyModel: new FormControl(this.searchReportModel.companyModel),
      publisherStatus: new FormControl(this.searchReportModel.publisherStatus),
      advertisementGroupModel: new FormControl(
        this.searchReportModel.advertisementGroupModel
      ),
      companyType: new FormControl(this.searchReportModel.companyType),
      advertisementType: new FormControl(
        this.searchReportModel.advertisementType
      ),
      description: new FormControl(this.searchReportModel.description),
      issueTrackingNo: new FormControl(this.searchReportModel.issueTrackingNo),
      code: new FormControl(this.searchReportModel.code),
      courseLength: new FormControl(this.searchReportModel.courseLength),
      companyInspectionInstituteModel: new FormControl(
        this.searchReportModel.companyInspectionInstituteModel
      ),
      isAudited: new FormControl(this.searchReportModel.isAudited),
      isNotAudited: new FormControl(this.searchReportModel.isNotAudited),
      isRootAdvert: new FormControl(this.searchReportModel.isRootAdvert),
      isLeafAdvert: new FormControl(this.searchReportModel.isLeafAdvert),
      isRootCompany: new FormControl(this.searchReportModel.isRootCompany),
      isLeafCompany: new FormControl(this.searchReportModel.isLeafCompany),
      isHolding: new FormControl(this.searchReportModel.isHolding),
      fromPublishDate: new FormControl(this.searchReportModel.fromPublishDate),
      toPublishDate: new FormControl(this.searchReportModel.toPublishDate),
    });

    this.getCompanies();
    this.getPublisherStatuses();
    this.getAdvertisementGroups();
    this.getCompanyTypes();
    this.getAdvertisementTypes(0);
    this.getCompanyInspectionInstitutes();
    this.courseLengths = [
      { title: '\u06F1', id: 1 },
      { title: '\u06F3', id: 3 },
      { title: '\u06F6', id: 6 },
      { title: '\u06F9', id: 9 },
      { title: '\u06F1\u06F2', id: 12 },
    ];
  }

  /*--------------------------
  # GET
  --------------------------*/
  /** Get roles from server. */
  getReportList(event?: LazyLoadEvent, companyId?: number) {
    const {
      companyModel,
      publisherStatus,
      advertisementGroupModel,
      companyType,
      advertisementType,
      description,
      issueTrackingNo,
      code,
      courseLength,
      companyInspectionInstituteModel,
      isAudited,
      isNotAudited,
      isRootAdvert,
      isLeafAdvert,
      isRootCompany,
      isLeafCompany,
      isHolding,
      fromPublishDate,
      toPublishDate,
    } = this.searchReportForm.value;

    const request = new Report();

    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    request.pageNumber = first / rows + 1;
    request.pageSize = rows;

    request.companyId = companyModel?.id || companyId;
    request.publisherStatusId = publisherStatus?.id;
    // request.advertisementGroupId = advertisementGroupModel?.id;
    request.companyTypeId = companyType?.id;
    request.advertisementTypeId = advertisementType?.id
      ? advertisementType?.id
      : advertisementGroupModel?.id;
    request.description = description;
    request.issueTrackingNo =
      issueTrackingNo &&
      Number(PersianNumberService.toEnglish(issueTrackingNo));
    request.code = code && Number(PersianNumberService.toEnglish(code));
    request.courseLength = courseLength?.id;
    request.companyInspectionInstituteId = companyInspectionInstituteModel?.id;
    request.isAudited = isAudited;
    request.isNotAudited = isNotAudited;
    request.isNotAudited = isNotAudited;
    request.isRootAdvert = isRootAdvert;
    request.isLeafAdvert = isLeafAdvert;
    request.isRootCompany = isRootCompany;
    request.isLeafCompany = isLeafCompany;
    request.isHolding = isHolding;
    request.fromPublishDate =
      fromPublishDate &&
      this.jDateCalculatorService.convertToGeorgian(
        fromPublishDate?.getFullYear(),
        fromPublishDate?.getMonth(),
        fromPublishDate?.getDate()
      );
    request.toPublishDate =
      toPublishDate &&
      this.jDateCalculatorService.convertToGeorgian(
        toPublishDate?.getFullYear(),
        toPublishDate?.getMonth(),
        toPublishDate?.getDate()
      );

    this.loading = true;

    this.httpService
      .post<Report[]>(UrlBuilder.build(Report.apiAddress, 'SEARCH'), request)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (
            response.data &&
            response.data.result &&
            response.data.result.length &&
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
  # Preview
  --------------------------*/
  previewDetails(report: Report) {
    this.selectedReport = report;
    this.previewDetailsDialog = true;
  }

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

  /*--------------------------
  # Attachment
  --------------------------*/
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
  # Search
  --------------------------*/
  resetSerachReportForm() {
    this.searchReportForm.reset();
    this.dataTable.reset();
  }

  disableSearchFields() {
    if (this.isHolding?.value) {
      this.searchReportForm.controls['companyModel'].disable();
      this.searchReportForm.controls['companyModel'].reset();

      this.searchReportForm.controls['publisherStatus'].disable();
      this.searchReportForm.controls['publisherStatus'].reset();

      this.searchReportForm.controls['advertisementGroupModel'].disable();
      this.searchReportForm.controls['advertisementGroupModel'].reset();

      this.searchReportForm.controls['companyType'].disable();
      this.searchReportForm.controls['companyType'].reset();

      this.searchReportForm.controls['advertisementType'].disable();
      this.searchReportForm.controls['advertisementType'].reset();

      this.searchReportForm.controls['code'].disable();
      this.searchReportForm.controls['code'].reset();

      this.searchReportForm.controls['courseLength'].disable();
      this.searchReportForm.controls['courseLength'].reset();

      this.searchReportForm.controls[
        'companyInspectionInstituteModel'
      ].disable();
      this.searchReportForm.controls['companyInspectionInstituteModel'].reset();

      this.searchReportForm.controls['isAudited'].disable();
      this.searchReportForm.controls['isAudited'].reset();

      this.searchReportForm.controls['isNotAudited'].disable();
      this.searchReportForm.controls['isNotAudited'].reset();

      this.searchReportForm.controls['isRootAdvert'].disable();
      this.searchReportForm.controls['isRootAdvert'].reset();

      this.searchReportForm.controls['isLeafAdvert'].disable();
      this.searchReportForm.controls['isLeafAdvert'].reset();

      this.searchReportForm.controls['isRootCompany'].disable();
      this.searchReportForm.controls['isRootCompany'].reset();

      this.searchReportForm.controls['isLeafCompany'].disable();
      this.searchReportForm.controls['isLeafCompany'].reset();
    } else {
      this.searchReportForm.controls['companyModel'].enable();
      this.searchReportForm.controls['publisherStatus'].enable();
      this.searchReportForm.controls['advertisementGroupModel'].enable();
      this.searchReportForm.controls['companyType'].enable();
      this.searchReportForm.controls['advertisementType'].enable();
      this.searchReportForm.controls['code'].enable();
      this.searchReportForm.controls['courseLength'].enable();
      this.searchReportForm.controls[
        'companyInspectionInstituteModel'
      ].enable();
      this.searchReportForm.controls['isAudited'].enable();
      this.searchReportForm.controls['isNotAudited'].enable();
      this.searchReportForm.controls['isRootAdvert'].enable();
      this.searchReportForm.controls['isLeafAdvert'].enable();
      this.searchReportForm.controls['isRootCompany'].enable();
      this.searchReportForm.controls['isLeafCompany'].enable();
    }

    this.getReportList();
  }

  /*--------------------------
  # PublisherStatus
  --------------------------*/
  getPublisherStatuses() {
    this.httpService
      .get<PublisherStatus[]>(PublisherStatus.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.publisherStatuses = response.data.result;
        }
      });
  }

  /*--------------------------
  # ActivityType
  --------------------------*/
  getAdvertisementGroups() {
    this.httpService
      .get<AdvertisementGroup[]>(AdvertisementGroup.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.advertisementGroup = response.data.result;
        }
      });
  }

  /*--------------------------
  # CompanyType
  --------------------------*/
  getCompanyTypes() {
    this.httpService
      .get<CompanyType[]>(CompanyType.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.companyTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # AdvertisementType
  --------------------------*/
  getAdvertisementTypes(groupId: number) {
    this.httpService
      .get<AdvertisementType[]>(AdvertisementType.apiAddress + '/' + groupId)
      .subscribe(response => {
        if (response.data.result) {
          this.advertisementTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # CompanyInspectionInstitute
  --------------------------*/
  getCompanyInspectionInstitutes() {
    this.httpService
      .get<CompanyInspectionInstitute[]>(CompanyInspectionInstitute.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.companyInspectionInstitutes = response.data.result;
        }
      });
  }

  /*--------------------------
  # Company
  --------------------------*/
  getCompanies() {
    this.httpService.get<Company[]>(Company.apiAddress).subscribe(response => {
      if (response.data.result) {
        this.companies = response.data.result;
      }
    });
  }

  onChangeAdverGroup() {
    const { advertisementGroupModel } = this.searchReportForm.value;
    this.getAdvertisementTypes(advertisementGroupModel?.id);
  }
}
