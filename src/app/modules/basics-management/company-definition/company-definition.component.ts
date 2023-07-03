/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import {
  ActivityType,
  Company,
  CompanyInspectionInstitute,
  CompanyTree,
  CompanyType,
  CreateCompany,
  DeleteCompany,
  ListCompany,
  Pagination,
  PublisherStatus,
  ReportingType,
  UrlBuilder,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-company-definition',
  templateUrl: './company-definition.component.html',
  styleUrls: ['./company-definition.component.scss'],
  providers: [ConfirmationService],
})
export class CompanyDefinitionComponent implements OnInit {
  /*--------------------------
  # ActivityType
  --------------------------*/
  /** نوع‌های فعالبت  */
  activityTypes: ActivityType[] = [];
  /** نوع فعالبت انتخاب شده */
  selectedActivityType = new ActivityType();

  /*--------------------------
  # CompanyType
  --------------------------*/
  /** نوع‌های شرکت  */
  companyTypes: CompanyType[] = [];
  /** نوع شرکت انتخاب شده */
  selectedCompanyType = new CompanyType();

  /*--------------------------
  # Parents
  --------------------------*/
  parents: CompanyTree[] = [];

  // selectedParent = new Company();

  /*--------------------------
  # ReportingType
  --------------------------*/
  reportingTypes: ReportingType[] = [];

  selectedReportingType = new ReportingType();

  /*--------------------------
  # PublisherStatus
  --------------------------*/
  publisherStatuses: PublisherStatus[] = [];

  selectedPublisherStatus = new PublisherStatus();

  /*--------------------------
  # companyInspectionInstitutes
  --------------------------*/
  /** موسسه حسابرسی شرکت */
  companyInspectionInstitutes: CompanyInspectionInstitute[] = [];
  /** موسسه حسابرسی شرکت انتخاب شده */
  selectedCompanyInspectionInstitute = new CompanyInspectionInstitute();

  /*--------------------------
  # From
  --------------------------*/
  addNewCompanyForm!: FormGroup;
  addNewCompanyModel = new Company();
  addNewCompanySubmitted = false;
  addNewCompanyLoading = false;

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

  selectedCompany = new Company();

  previewDetailsDialog = false;

  fomrCollapsed = true;

  selectedSubject = new Company();

  /** Main table first row */
  dataTableFirst = 0;

  gridClass = 'p-datatable-sm';

  get parent() {
    return this.addNewCompanyForm.get('parent');
  }
  get companyTypeModel() {
    return this.addNewCompanyForm.get('companyTypeModel');
  }
  get activityType() {
    return this.addNewCompanyForm.get('activityType');
  }
  get companyName() {
    return this.addNewCompanyForm.get('companyName');
  }
  get latinName() {
    return this.addNewCompanyForm.get('latinName');
  }
  get nationalID() {
    return this.addNewCompanyForm.get('nationalID');
  }
  get symbol() {
    return this.addNewCompanyForm.get('symbol');
  }
  get registerDate() {
    return this.addNewCompanyForm.get('registerDate');
  }
  get registerNumber() {
    return this.addNewCompanyForm.get('registerNumber');
  }
  get isic() {
    return this.addNewCompanyForm.get('isic');
  }
  get companyISIN() {
    return this.addNewCompanyForm.get('companyISIN');
  }
  get registeredCapital() {
    return this.addNewCompanyForm.get('registeredCapital');
  }
  get nonRegisteredCapital() {
    return this.addNewCompanyForm.get('nonRegisteredCapital');
  }
  get publisherStatus() {
    return this.addNewCompanyForm.get('publisherStatus');
  }
  get yearEnd() {
    return this.addNewCompanyForm.get('yearEnd');
  }
  get reportingType() {
    return this.addNewCompanyForm.get('reportingType');
  }
  get companyInspectionInstitute() {
    return this.addNewCompanyForm.get('companyInspectionInstitute');
  }
  get activitySubject() {
    return this.addNewCompanyForm.get('activitySubject');
  }
  get factoryAddress() {
    return this.addNewCompanyForm.get('factoryAddress');
  }
  get factoryTelephone() {
    return this.addNewCompanyForm.get('factoryTelephone');
  }
  get factoryFax() {
    return this.addNewCompanyForm.get('factoryFax');
  }
  get stockAffairsOffice() {
    return this.addNewCompanyForm.get('stockAffairsOffice');
  }
  get stockAffairsTelephone() {
    return this.addNewCompanyForm.get('stockAffairsTelephone');
  }
  get stockAffairsFax() {
    return this.addNewCompanyForm.get('stockAffairsFax');
  }
  get centeralOffice() {
    return this.addNewCompanyForm.get('centeralOffice');
  }
  get centeralOfficeTelephone() {
    return this.addNewCompanyForm.get('centeralOfficeTelephone');
  }
  get centeralOfficeFax() {
    return this.addNewCompanyForm.get('centeralOfficeFax');
  }
  get managingDirector() {
    return this.addNewCompanyForm.get('managingDirector');
  }
  get financialManager() {
    return this.addNewCompanyForm.get('financialManager');
  }
  get boardofDirectors() {
    return this.addNewCompanyForm.get('boardofDirectors');
  }
  get alternateInspector() {
    return this.addNewCompanyForm.get('boardofDirectors');
  }
  get substituteInspector() {
    return this.addNewCompanyForm.get('substituteInspector');
  }

  constructor(
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.addNewCompanyForm = new FormGroup({
      parent: new FormControl(this.addNewCompanyModel.parent),
      companyTypeModel: new FormControl(
        this.addNewCompanyModel.companyTypeModel,
        Validators.required
      ),
      activityType: new FormControl(
        this.addNewCompanyModel.activityType,
        Validators.required
      ),
      companyName: new FormControl(
        this.addNewCompanyModel.companyName,
        Validators.required
      ),
      latinName: new FormControl(
        this.addNewCompanyModel.latinName,
        Validators.required
      ),
      nationalID: new FormControl(
        this.addNewCompanyModel.nationalID,
        Validators.required
      ),
      symbol: new FormControl(
        this.addNewCompanyModel.symbol,
        Validators.required
      ),
      registerDate: new FormControl(
        this.addNewCompanyModel.registerDate,
        Validators.required
      ),
      registerNumber: new FormControl(
        this.addNewCompanyModel.registerNumber,
        Validators.required
      ),
      isic: new FormControl(this.addNewCompanyModel.isic, Validators.required),
      companyISIN: new FormControl(
        this.addNewCompanyModel.companyISIN,
        Validators.required
      ),
      registeredCapital: new FormControl(
        this.addNewCompanyModel.registeredCapital,
        Validators.required
      ),
      nonRegisteredCapital: new FormControl(
        this.addNewCompanyModel.nonRegisteredCapital,
        Validators.required
      ),
      publisherStatus: new FormControl(
        this.addNewCompanyModel.publisherStatus,
        Validators.required
      ),
      yearEnd: new FormControl(
        this.addNewCompanyModel.yearEnd,
        Validators.required
      ),
      reportingType: new FormControl(
        this.addNewCompanyModel.reportingType,
        Validators.required
      ),
      companyInspectionInstitute: new FormControl(
        this.addNewCompanyModel.companyInspectionInstitute,
        Validators.required
      ),
      activitySubject: new FormControl(
        this.addNewCompanyModel.activitySubject,
        Validators.required
      ),
      factoryAddress: new FormControl(this.addNewCompanyModel.factoryAddress),
      factoryTelephone: new FormControl(
        this.addNewCompanyModel.factoryTelephone
      ),
      factoryFax: new FormControl(this.addNewCompanyModel.factoryFax),
      stockAffairsOffice: new FormControl(
        this.addNewCompanyModel.stockAffairsOffice
      ),
      stockAffairsTelephone: new FormControl(
        this.addNewCompanyModel.stockAffairsTelephone
      ),
      stockAffairsFax: new FormControl(this.addNewCompanyModel.stockAffairsFax),
      centeralOffice: new FormControl(this.addNewCompanyModel.centeralOffice),
      centeralOfficeTelephone: new FormControl(
        this.addNewCompanyModel.centeralOfficeTelephone
      ),
      centeralOfficeFax: new FormControl(
        this.addNewCompanyModel.centeralOfficeFax
      ),
      managingDirector: new FormControl(
        this.addNewCompanyModel.managingDirector
      ),
      financialManager: new FormControl(
        this.addNewCompanyModel.financialManager
      ),
      boardofDirectors: new FormControl(
        this.addNewCompanyModel.boardofDirectors
      ),
      substituteInspector: new FormControl(
        this.addNewCompanyModel.substituteInspector
      ),
    });

    this.getActivityTypes();
    this.getCompanyTypes();
    // this.getParents();
    this.getCompanyTree();
    this.getReportingTypes();
    this.getPublisherStatuses();
    this.getCompanyInspectionInstitutes();
  }

  /*--------------------------
  # ActivityType
  --------------------------*/
  getActivityTypes() {
    this.httpService
      .get<ActivityType[]>(ActivityType.apiAddress + `/${1}`)
      .subscribe(response => {
        if (response.data.result) {
          this.activityTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # CompanyType
  --------------------------*/
  getCompanyTypes() {
    this.httpService
      .get<CompanyType[]>(CompanyType.apiAddress + `/${1}`)
      .subscribe(response => {
        if (response.data.result) {
          this.companyTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # Parents
  --------------------------*/
  // getParents() {
  //   this.httpService.get<Company[]>(Company.apiAddress).subscribe(response => {
  //     if (response.data.result) {
  //       this.parents = response.data.result;
  //     }
  //   });
  // }

  /*--------------------------
  # ReportingType
  --------------------------*/
  getReportingTypes() {
    this.httpService
      .get<ReportingType[]>(ReportingType.apiAddress + `/${1}`)
      .subscribe(response => {
        if (response.data.result) {
          this.reportingTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # PublisherStatus
  --------------------------*/
  getPublisherStatuses() {
    this.httpService
      .get<PublisherStatus[]>(PublisherStatus.apiAddress + `/${1}`)
      .subscribe(response => {
        if (response.data.result) {
          this.publisherStatuses = response.data.result;
        }
      });
  }

  /*--------------------------
  # CompanyInspectionInstitute
  --------------------------*/
  getCompanyInspectionInstitutes() {
    this.httpService
      .get<CompanyInspectionInstitute[]>(
        CompanyInspectionInstitute.apiAddress + `/${1}`
      )
      .subscribe(response => {
        if (response.data.result) {
          this.companyInspectionInstitutes = response.data.result;
        }
      });
  }

  /*--------------------------
  # CREATE
  --------------------------*/
  addNewCompany() {
    this.addNewCompanySubmitted = true;

    if (this.addNewCompanyForm.valid) {
      const {
        parent,
        companyTypeModel,
        activityType,
        companyName,
        latinName,
        nationalID,
        symbol,
        registerDate,
        registerNumber,
        isic,
        companyISIN,
        registeredCapital,
        nonRegisteredCapital,
        publisherStatus,
        yearEnd,
        reportingType,
        companyInspectionInstitute,
        activitySubject,
        factoryAddress,
        factoryTelephone,
        factoryFax,
        stockAffairsOffice,
        stockAffairsTelephone,
        stockAffairsFax,
        centeralOffice,
        centeralOfficeTelephone,
        centeralOfficeFax,
        managingDirector,
        financialManager,
        boardofDirectors,
        substituteInspector,
      } = this.addNewCompanyForm.value;

      const request = new Company();
      request.nationalID = PersianNumberService.toEnglish(nationalID);
      request.registeredCapital = registeredCapital;
      request.nonRegisteredCapital = nonRegisteredCapital;
      request.isic = isic;
      request.companyISIN = companyISIN;
      request.companyName = companyName;
      request.registerNumber = registerNumber;
      request.registerDate = this.jDateCalculatorService.convertToGeorgian(
        registerDate?.getFullYear(),
        registerDate?.getMonth(),
        registerDate?.getDate()
      );
      request.companyTypeId = companyTypeModel.id;
      request.activityTypeId = activityType.id;
      request.symbol = symbol;
      request.parentId = parent.id;
      request.latinName = latinName;
      request.yearEnd = this.jDateCalculatorService.convertToGeorgian(
        yearEnd?.getFullYear(),
        yearEnd?.getMonth(),
        yearEnd?.getDate()
      );
      request.activitySubject = activitySubject;
      request.reportingTypeId = reportingType.id;
      request.publisherStatusId = publisherStatus.id;
      request.factoryAddress = factoryAddress;
      request.factoryTelephone = factoryTelephone;
      request.factoryFax = factoryFax;
      request.stockAffairsOffice = stockAffairsOffice;
      request.stockAffairsTelephone = stockAffairsTelephone;
      request.stockAffairsFax = stockAffairsFax;
      request.centeralOffice = centeralOffice;
      request.centeralOfficeTelephone = centeralOfficeTelephone;
      request.centeralOfficeFax = centeralOfficeFax;
      request.managingDirector = managingDirector;
      request.financialManager = financialManager;
      request.boardofDirectors = boardofDirectors;
      request.substituteInspector = substituteInspector;
      request.companyInspectionInstituteId = companyInspectionInstitute.id;

      this.addNewCompanyLoading = true;

      this.httpService
        .post<CreateCompany>(CreateCompany.apiAddress, request)
        .pipe(tap(() => (this.addNewCompanyLoading = false)))
        .subscribe(response => {
          if (response.successed) {
            this.getCompanyList();
            this.resetAddNewCompanyForm();

            this.messageService.add({
              key: 'companyDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعات شرکت`,
              summary: 'با موفقیت درج شد',
            });
          }
        });
    }
  }
  resetAddNewCompanyForm() {
    this.addNewCompanySubmitted = false;
    this.addNewCompanyForm.reset();
  }

  /*--------------------------
  # GET
  --------------------------*/
  getCompanyList(event?: LazyLoadEvent) {
    const pagination = new Pagination();
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Company[]>(ListCompany.apiAddress, {
        id: this.selectedCompany.id || 0,
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

  editRow(company: Company) {
    if (company.id) {
      this.selectedSubject = company;
      this.addNewCompanyForm.patchValue(company);
      this.addNewCompanyForm.patchValue({
        parent: this.parents.find(data => data.id === company.parentId),
        companyTypeModel: this.companyTypes.find(
          data => data.id === company.companyTypeId
        ),
        activityType: this.activityTypes.find(
          data => data.id === company.activityTypeId
        ),
        publisherStatus: this.publisherStatuses.find(
          data => data.id === company.publisherStatusId
        ),
        reportingType: this.reportingTypes.find(
          data => data.id === company.reportingTypeId
        ),
        companyInspectionInstitute: this.companyInspectionInstitutes.find(
          data => data.id === company.companyInspectionInstituteId
        ),
        registerDate: new JDate(new Date(company.registerDate)),
        yearEnd: new JDate(new Date(company.yearEnd)),
      });
      this.fomrCollapsed = false;
    }
  }

  deleteRow(company: Company) {
    if (company && company.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف شرکت اطمینان دارید؟',
        header: `عنوان ${company.companyName}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteCompany(company.id, company.companyName),
      });
  }

  deleteCompany(id: number, companyName: string) {
    if (id && companyName) {
      this.httpService
        .delete<Company>(
          UrlBuilder.build(DeleteCompany.apiAddress, 'DELETE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.dataTableFirst = 0;
            this.getCompanyList();

            this.messageService.add({
              key: 'subjectDefinition',
              life: 8000,
              severity: 'success',
              detail: `شرکت ${companyName}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewSubjectForm();
          }
        });
    }
  }

  resetAddNewSubjectForm() {
    this.addNewCompanySubmitted = false;
    this.addNewCompanyForm.reset();
    this.selectedCompany = new Company();
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
}
