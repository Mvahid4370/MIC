/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { map, tap } from 'rxjs';

import { HttpService } from '@core/http/http.service';
import {
  CreatePerson,
  DeletePerson,
  Pagination,
  Person,
  UpdatePerson,
} from '@shared/models/response.model';
import { PasswordValidator } from '@shared/validators/password.validator';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { JDate } from '@shared/utilities/JDate/jdate';

export class SearchPerson extends Pagination {
  /** نام */
  firstName!: string;

  /** نام خانوادگی */
  lastName!: string;

  /** کد ملی */
  nationalId!: string;
}

@Component({
  selector: 'marketwatch-user-definition',
  templateUrl: './user-definition.component.html',
  styleUrls: ['./user-definition.component.scss'],
  providers: [ConfirmationService],
})
export class UserDefinitionComponent implements OnInit {
  /** Main table total count. */
  totalCount!: number;

  /** Main table data. */
  personList: Person[] = [];

  /** Main table data. */
  selectedPerson = new Person();

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  /** Main table first row */
  dataTableFirst = 0;

  gridClass = 'p-datatable-sm';

  /*--------------------------
  # SEARCH USER
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  searchPersonForm!: FormGroup;

  /** مدل جستجو کاربر */
  searchPersonModel = new Person();

  /** نام */
  get searchFirstName() {
    return this.searchPersonForm.get('firstName');
  }
  /** نام خانوادگی */
  get searchLastName() {
    return this.searchPersonForm.get('lastName');
  }
  /** کد ملی */
  get searchNationalId() {
    return this.searchPersonForm.get('nationalId');
  }

  /*--------------------------
  # ADD USER
  --------------------------*/
  /** گروه فرم افزودن کاربر جدید */
  addNewPersonForm!: FormGroup;

  /** مدل افزودن کاربر جدید */
  addNewPersonModel = new Person();

  /** وضعیت تایید افزودن کاربر جدید */
  addNewPersonFormSubmitted = false;

  /** انتظار برای افزودن کاربر جدید*/
  addNewPersonFormLoading = false;

  /** انتظار برای ویرایش کاربر */
  editPersonFormLoading = false;

  /** انتظار برای حذف کاربر */
  deletePersonFormLoading = false;

  /** نام */
  get firstName() {
    return this.addNewPersonForm.get('firstName');
  }
  /** نام خانوادگی */
  get lastName() {
    return this.addNewPersonForm.get('lastName');
  }
  /** نام پدر */
  get fatherName() {
    return this.addNewPersonForm.get('fatherName');
  }
  /** جنسیت */
  get genderType() {
    return this.addNewPersonForm.get('genderType');
  }
  /** کد ملی */
  get nationalId() {
    return this.addNewPersonForm.get('nationalId');
  }
  /** تاریخ تولد */
  get birthDate() {
    return this.addNewPersonForm.get('birthDate');
  }
  /** شماره شناسنامه */
  get birthCertificateNumber() {
    return this.addNewPersonForm.get('birthCertificateNumber');
  }
  /** نام کاربری */
  get userName() {
    return this.addNewPersonForm.get('userName');
  }
  /** رمز عبور */
  get password() {
    return this.addNewPersonForm.get('password');
  }
  /** نام کاربری */
  get rePassword() {
    return this.addNewPersonForm.get('rePassword');
  }

  @ViewChild('dataTable') dataTable!: Table;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.searchPersonForm = new FormGroup({
      searchFirstName: new FormControl(this.searchPersonModel.firstName),
      searchLastName: new FormControl(this.searchPersonModel.lastName),
      searchNationalId: new FormControl(this.searchPersonModel.nationalId),
    });

    this.addNewPersonForm = new FormGroup(
      {
        firstName: new FormControl(
          this.addNewPersonModel.firstName,
          Validators.required
        ),
        lastName: new FormControl(
          this.addNewPersonModel.lastName,
          Validators.required
        ),
        fatherName: new FormControl(
          this.addNewPersonModel.fatherName,
          Validators.required
        ),
        genderType: new FormControl(
          this.addNewPersonModel.genderType,
          Validators.required
        ),
        nationalId: new FormControl(
          this.addNewPersonModel.nationalId,
          Validators.required
        ),
        birthDate: new FormControl(
          this.addNewPersonModel.birthDate,
          Validators.required
        ),
        birthCertificateNumber: new FormControl(
          this.addNewPersonModel.birthCertificateNumber,
          Validators.required
        ),
        userName: new FormControl(
          this.addNewPersonModel.userName,
          Validators.required
        ),
        password: new FormControl(this.addNewPersonModel.password, [
          Validators.required,
          Validators.minLength(8),
        ]),
        rePassword: new FormControl(this.addNewPersonModel.rePassword, [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: PasswordValidator.matchPasswords('password', 'rePassword'),
      }
    );

    this.addNewPersonForm.patchValue({ genderType: 0 });
  }

  /*--------------------------
  # GET
  --------------------------*/
  /** Get person list from server. */
  getPersonList(event?: LazyLoadEvent, searchModel = new SearchPerson()) {
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Person[]>(Person.apiAddress, searchModel)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data)
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;

          if (response.data.result) return response.data.result;
          else return [new Person()];
        })
      )
      .subscribe(personList => (this.personList = personList));
  }

  /** Search person by input fields. */
  serachPerson() {
    if (this.searchPersonForm.valid) {
      const { searchFirstName, searchLastName, searchNationalId } =
        this.searchPersonForm.value;

      const searchModel = new SearchPerson();
      searchModel.firstName = PersianNumberService.toEnglish(searchFirstName);
      searchModel.lastName = PersianNumberService.toEnglish(searchLastName);
      searchModel.nationalId = PersianNumberService.toEnglish(searchNationalId);

      this.getPersonList({}, searchModel);
    }
  }

  /*--------------------------
  # INSERT
  --------------------------*/
  /** Add new person */
  addNewPerson() {
    this.addNewPersonFormSubmitted = true;

    if (this.addNewPersonForm.valid) {
      this.addNewPersonFormLoading = true;

      const {
        firstName,
        lastName,
        fatherName,
        genderType,
        nationalId,
        birthDate,
        birthCertificateNumber,
        userName,
        password,
        rePassword,
      } = this.addNewPersonForm.value;

      const request = new Person();
      request.firstName = PersianNumberService.toEnglish(firstName);
      request.lastName = PersianNumberService.toEnglish(lastName);
      request.fatherName = PersianNumberService.toEnglish(fatherName);
      request.genderType = genderType;
      request.nationalId = PersianNumberService.toEnglish(nationalId);
      request.birthDate = this.jDateCalculatorService.convertToGeorgian(
        birthDate?.getFullYear(),
        birthDate?.getMonth(),
        birthDate?.getDate()
      );
      request.birthCertificateNumber = PersianNumberService.toEnglish(
        birthCertificateNumber
      );
      request.userName = PersianNumberService.toEnglish(userName);
      request.password = password;
      request.rePassword = rePassword;

      this.httpService
        .post<CreatePerson>(CreatePerson.apiAddress, request)
        .pipe(
          tap(() => {
            this.addNewPersonFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getPersonList();

            this.messageService.add({
              key: 'userDefinition',
              life: 8000,
              severity: 'success',
              detail: `کاربر ${PersianNumberService.toPersian(
                firstName
              )} ${PersianNumberService.toPersian(lastName)}`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewPersonForm();
          }
        });
    }
  }

  /*--------------------------
  # UPDATE
  --------------------------*/

  /** On edit data table row.
   * @param person person model
   */
  onEdit(person: Person) {
    this.selectedPerson = person;
    this.selectedPerson.birthDate = new JDate(
      new Date(this.selectedPerson.birthDate)
    );
    this.addNewPersonForm.patchValue(this.selectedPerson);

    /* Remove user panel validation */
    this.addNewPersonForm.get('userName')?.clearValidators();
    this.addNewPersonForm.get('userName')?.updateValueAndValidity();

    this.addNewPersonForm.get('password')?.clearValidators();
    this.addNewPersonForm.get('password')?.updateValueAndValidity();

    this.addNewPersonForm.get('rePassword')?.clearValidators();
    this.addNewPersonForm.get('rePassword')?.updateValueAndValidity();
  }

  /** Edit person */
  editPerson(person: Person) {
    if (this.addNewPersonForm.valid) {
      this.editPersonFormLoading = true;

      const {
        firstName,
        lastName,
        fatherName,
        genderType,
        nationalId,
        birthDate,
        birthCertificateNumber,
      } = this.addNewPersonForm.value;

      const request = new Person();
      request.id = person.id;
      request.firstName = PersianNumberService.toEnglish(firstName);
      request.lastName = PersianNumberService.toEnglish(lastName);
      request.fatherName = PersianNumberService.toEnglish(fatherName);
      request.genderType = genderType;
      request.nationalId = PersianNumberService.toEnglish(nationalId);
      request.birthDate = this.jDateCalculatorService.convertToGeorgian(
        birthDate?.getFullYear(),
        birthDate?.getMonth(),
        birthDate?.getDate()
      );
      request.birthCertificateNumber = PersianNumberService.toEnglish(
        birthCertificateNumber
      );

      this.httpService
        .put<UpdatePerson>(UpdatePerson.apiAddress, request)
        .pipe(
          tap(() => {
            this.editPersonFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getPersonList();

            this.messageService.add({
              key: 'userDefinition',
              life: 8000,
              severity: 'success',
              detail: `کاربر  ${PersianNumberService.toPersian(firstName)}`,
              summary: 'با موفقیت ویرایش شد',
            });

            this.resetAddNewPersonForm();
          }
        });
    }
  }

  /*--------------------------
  # DELETE
  --------------------------*/
  /**
   * On delete data table row
   * @param person person model
   */
  onDelete(person: Person) {
    if (person && person.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف کاربر اطمینان دارید؟',
        header: `کاربر ${person.firstName}`,
        icon: 'pi pi-user-minus',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePerson(person.id, person.firstName),
      });
  }

  /** Delete person */
  deletePerson(id: number, firstName: string) {
    if (id && firstName) {
      this.editPersonFormLoading = true;

      this.httpService
        .delete<DeletePerson>(DeletePerson.apiAddress + id + '/delete')
        .pipe(
          tap(() => {
            this.editPersonFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getPersonList();
            this.dataTableFirst = 0;

            this.messageService.add({
              key: 'userDefinition',
              life: 8000,
              severity: 'success',
              detail: `کاربر ${PersianNumberService.toPersian(firstName)}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewPersonForm();
          }
        });
    }
  }

  /*--------------------------
  # EXTRA
  --------------------------*/
  /** Reset add new person form. */
  resetAddNewPersonForm() {
    this.addNewPersonFormSubmitted = false;
    this.addNewPersonForm.reset();
    this.selectedPerson = new Person();
    this.addNewPersonForm.patchValue({
      genderType: 0,
    });

    /** Add user panel validation */
    this.addNewPersonForm.get('userName')?.setValidators(Validators.required);
    this.addNewPersonForm.get('userName')?.updateValueAndValidity();

    this.addNewPersonForm
      .get('passwored')
      ?.setValidators([Validators.required, Validators.minLength(8)]);
    this.addNewPersonForm.get('password')?.updateValueAndValidity();

    this.addNewPersonForm
      .get('rePassword')
      ?.setValidators([Validators.required, Validators.minLength(8)]);
    this.addNewPersonForm.get('rePassword')?.updateValueAndValidity();
  }
}
