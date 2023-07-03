import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import {
  AttachmentType,
  UrlBuilder,
  FileType,
} from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-attachment-type-definition',
  templateUrl: './attachment-type-definition.component.html',
  styleUrls: ['./attachment-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class AttachmentTypeDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  attachmentTypes: AttachmentType[] = [];

  /** Main table loading. */
  loading = false;
  files: FileType[] = [];

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewAttachmentTypeForm!: FormGroup;

  addNewAttachmentTypeModel = new AttachmentType();

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  get title() {
    return this.addNewAttachmentTypeForm.get('title');
  }
  get enName() {
    return this.addNewAttachmentTypeForm.get('enName');
  }

  get tempPath() {
    return this.addNewAttachmentTypeForm.get('tempPath');
  }

  get fileMimeTypeId() {
    return this.addNewAttachmentTypeForm.get('fileMimeTypeId');
  }

  addNewAttachmentTypeLoading = false;

  addNewAttachmentTypeFormSubmitted = false;

  selectedAttachmentType = new AttachmentType();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAttachmentTypes();
    this.getFileTypes();
    this.addNewAttachmentTypeForm = new FormGroup({
      title: new FormControl(
        this.addNewAttachmentTypeModel.title,
        Validators.required
      ),
      enName: new FormControl(
        this.addNewAttachmentTypeModel.enName,
        Validators.required
      ),
      tempPath: new FormControl(
        this.addNewAttachmentTypeModel.tempPath,
        Validators.required
      ),
      fileMimeTypeId: new FormControl(
        this.addNewAttachmentTypeModel.fileMimeTypeId,
        Validators.required
      ),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get attachmentTypes from server. */
  getAttachmentTypes() {
    this.loading = true;

    this.httpService
      .get<AttachmentType[]>(
        UrlBuilder.build(AttachmentType.apiAddress, 'LIST')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new AttachmentType()];
        })
      )
      .subscribe(attachmentTypes => (this.attachmentTypes = attachmentTypes));
  }

  addOrUpdateAttachmentType() {
    this.addNewAttachmentTypeFormSubmitted = true;

    if (this.addNewAttachmentTypeForm.valid) {
      this.addNewAttachmentTypeLoading = true;

      const { title, enName, tempPath, fileMimeTypeId } =
        this.addNewAttachmentTypeForm.value;

      const request = new AttachmentType();
      request.id = this.selectedAttachmentType.id || 0;
      request.title = title;
      request.enName = enName;
      request.tempPath = tempPath;
      request.fileMimeTypeId = fileMimeTypeId;

      const typeOpe = request.id ? 'EDIT' : 'ADD';

      this.httpService
        .post<AttachmentType>(
          UrlBuilder.build(AttachmentType.apiAddress, typeOpe),
          request
        )
        .pipe(
          tap(() => {
            this.addNewAttachmentTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getAttachmentTypes();

            this.messageService.add({
              key: 'attachmentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع پیوست`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewAttachmentTypeForm();
          }
        });
    }
  }

  editRow(fileType: AttachmentType) {
    if (fileType.id) {
      this.selectedAttachmentType = fileType;
      this.addNewAttachmentTypeForm.patchValue(fileType);
    }
  }

  deleteRow(fileType: AttachmentType) {
    if (fileType && fileType.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف نوع پیوست اطمینان دارید؟',
        header: `نوع پیوست ${fileType.title}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteAttachmentType(fileType.id, fileType.title),
      });
  }

  deleteAttachmentType(id: number, type: string) {
    if (id && type) {
      this.httpService
        .delete<AttachmentType>(
          UrlBuilder.build(AttachmentType.apiAddress, 'REMOVE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.getAttachmentTypes();

            this.messageService.add({
              key: 'attachmentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع پیوست ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewAttachmentTypeForm();
          }
        });
    }
  }

  resetAddNewAttachmentTypeForm() {
    this.addNewAttachmentTypeFormSubmitted = false;
    this.addNewAttachmentTypeForm.reset();
    this.selectedAttachmentType = new AttachmentType();
  }

  getFileTypes() {
    // this.httpService
    //   .get<FileType[]>(FileType.apiAddress, 'LIST')
    //   .subscribe(response => {
    //     if (response.data.result && response.data.result.length) {
    //       this.files = response.data.result;
    //       this.selectedFileType = response.data.result[0];
    //     }
    //   });

    this.httpService
      .get<FileType[]>(UrlBuilder.build(FileType.apiAddress, 'LIST'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new FileType()];
        })
      )
      .subscribe(fileTypes => (this.files = fileTypes));
  }
}
