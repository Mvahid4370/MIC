import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import { AdvertismentType, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-advertisment-type-definition',
  templateUrl: './advertisment-type-definition.component.html',
  styleUrls: ['./advertisment-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class AdvertismentTypeDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  advertismentTypes: AdvertismentType[] = [];
  advertismentTypesTree: AdvertismentType[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewAdvertismentTypeForm!: FormGroup;

  addNewAdvertismentTypeModel = new AdvertismentType();

  get title() {
    return this.addNewAdvertismentTypeForm.get('title');
  }
  get code() {
    return this.addNewAdvertismentTypeForm.get('code');
  }

  get parentId() {
    return this.addNewAdvertismentTypeForm.get('parentId');
  }

  addNewAdvertismentTypeLoading = false;

  addNewAdvertismentTypeFormSubmitted = false;

  selectedAdvertismentType = new AdvertismentType();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAdvertismentTypes();
    this.getAdvertismentTypesTree();
    this.addNewAdvertismentTypeForm = new FormGroup({
      title: new FormControl(
        this.addNewAdvertismentTypeModel.title,
        Validators.required
      ),
      code: new FormControl(this.addNewAdvertismentTypeModel.code),
      parentId: new FormControl(this.addNewAdvertismentTypeModel.parentId),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get advertismentTypes from server. */
  getAdvertismentTypes() {
    this.loading = true;

    this.httpService
      .get<AdvertismentType[]>(
        UrlBuilder.build(AdvertismentType.apiAddress, 'LIST')
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

  getAdvertismentTypesTree() {
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
        advertismentTypes => (this.advertismentTypesTree = advertismentTypes)
      );
  }

  addOrUpdateAdvertismentType() {
    this.addNewAdvertismentTypeFormSubmitted = true;

    if (this.addNewAdvertismentTypeForm.valid) {
      this.addNewAdvertismentTypeLoading = true;

      const { title, code, parentId } = this.addNewAdvertismentTypeForm.value;

      const request = new AdvertismentType();
      request.id = this.selectedAdvertismentType.id || 0;
      request.title = title;
      request.code = code;
      request.parentId = parentId.key;

      const typeOpe = request.id ? 'UPDATE' : 'CREATE';

      this.httpService
        .post<AdvertismentType>(
          UrlBuilder.build(AdvertismentType.apiAddress, typeOpe),
          request
        )
        .pipe(
          tap(() => {
            this.addNewAdvertismentTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getAdvertismentTypes();

            this.messageService.add({
              key: 'advertismentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع اطلاعیه`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewAdvertismentTypeForm();
          }
        });
    }
  }

  editRow(advertismentType: AdvertismentType) {
    if (advertismentType.id) {
      this.selectedAdvertismentType = advertismentType;
      this.addNewAdvertismentTypeForm.patchValue(advertismentType);
    }
  }

  deleteRow(advertismentType: AdvertismentType) {
    if (advertismentType && advertismentType.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف نوع اطلاعیه اطمینان دارید؟',
        header: `نوع اطلاعیه ${advertismentType.title}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () =>
          this.deleteAdvertismentType(
            advertismentType.id,
            advertismentType.title
          ),
      });
  }

  deleteAdvertismentType(id: number, type: string) {
    if (id && type) {
      this.httpService
        .delete<AdvertismentType>(
          UrlBuilder.build(AdvertismentType.apiAddress, 'REMOVE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.getAdvertismentTypes();

            this.messageService.add({
              key: 'advertismentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع اطلاعیه ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewAdvertismentTypeForm();
          }
        });
    }
  }

  resetAddNewAdvertismentTypeForm() {
    this.addNewAdvertismentTypeFormSubmitted = false;
    this.addNewAdvertismentTypeForm.reset();
    this.selectedAdvertismentType = new AdvertismentType();
  }
}
