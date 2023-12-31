/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Basics,
  CreateBasics,
  Subject,
  UrlBuilder,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-basics-definition',
  templateUrl: './basics-definition.component.html',
  styleUrls: ['./basics-definition.component.scss'],
})
export class BasicsDefinitionComponent implements OnInit {
  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  basicsList: Basics[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  gridClass = 'p-datatable-sm';

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewBasicsForm!: FormGroup;

  addNewBasicsModel = new Basics();

  get code() {
    return this.addNewBasicsForm.get('code');
  }
  get title() {
    return this.addNewBasicsForm.get('title');
  }

  addNewBasicsLoading = false;

  addNewBasicsFormSubmitted = false;

  /*--------------------------
  # SUBJECT
  --------------------------*/
  /** عنوان‌ها  */
  subjects: Subject[] = [];

  /** عنوان انتخاب شده */
  selectedSubject = new Subject();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getBasicsList();
    this.addNewBasicsForm = new FormGroup({
      code: new FormControl(this.addNewBasicsModel.code, Validators.required),
      title: new FormControl(this.addNewBasicsModel.title, Validators.required),
    });

    this.getSubjects();
  }

  /*--------------------------
  # GET
  --------------------------*/
  /** Get subjects from server. */
  getSubjects() {
    this.loading = true;

    this.httpService
      .get<Subject[]>(UrlBuilder.build(Subject.apiAddress, 'LIST'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new Subject()];
        })
      )
      .subscribe(subjects => {
        this.subjects = subjects;
        if (subjects.length) {
          this.selectedSubject = subjects[0];
          this.getBasicsList(subjects[0].id);
        }
      });
  }

  /** Get basics from server. */
  getBasicsList(subjectId?: number) {
    if (subjectId) {
      this.loading = true;

      this.httpService
        .get<Basics[]>(
          UrlBuilder.build(Basics.apiAddress + `/${subjectId}`, 'DETAIL')
        )
        .pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.result)
              return response.data.result;
            else return [new Basics()];
          })
        )
        .subscribe(basicsList => (this.basicsList = basicsList));
    }
  }

  /*--------------------------
  # CREATE
  --------------------------*/
  /** Add new basics */
  addNewBasics() {
    this.addNewBasicsFormSubmitted = true;

    if (this.addNewBasicsForm.valid) {
      this.addNewBasicsLoading = true;

      const { code, title } = this.addNewBasicsForm.value;

      const request = new Basics();
      request.masterId = this.selectedSubject.id;
      request.code = PersianNumberService.toEnglish(code);
      request.title = title;

      this.httpService
        .post<CreateBasics>(CreateBasics.apiAddress, request)
        .pipe(
          tap(() => {
            this.addNewBasicsLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getBasicsList(this.selectedSubject.id);

            this.messageService.add({
              key: 'basicsDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعات`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewBasicsForm();
          }
        });
    }
  }

  /** Reset add new basics form. */
  resetAddNewBasicsForm() {
    this.addNewBasicsFormSubmitted = false;
    this.addNewBasicsForm.reset();
  }
}
