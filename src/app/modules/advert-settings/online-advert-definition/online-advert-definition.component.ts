import { Component, OnInit } from '@angular/core';
import { SidemenuService } from '@core/layout/sidemenu/sidemenu.service';
import { HttpService } from '@core/http/http.service';
import {
  AdvertismentType,
  AdvertismentTypeFileNeeds,
  UrlBuilder,
  CreateOnlineAdvertDefinition,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';

@Component({
  selector: 'marketwatch-online-advert-definition',
  templateUrl: './online-advert-definition.component.html',
  styleUrls: ['./online-advert-definition.component.scss'],
  providers: [],
})
export class OnlineAdvertDefinitionComponent implements OnInit {
  onlineAdvertDefinitionForm!: FormGroup;
  nodes: any;
  needs: any;

  advertismentTypes: AdvertismentType[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  onlineAdvertDefinitionFormLoading = false;

  // clonedNeeds: AdvertismentTypeFileNeeds = this.needs;

  onlineAdvertDefinitionFormSubmitted = false;

  createOnlineAdvertDefinitionModel = new CreateOnlineAdvertDefinition();

  get advertisementTypeId() {
    return this.onlineAdvertDefinitionForm.get('advertisementTypeId');
  }

  get activeDate() {
    return this.onlineAdvertDefinitionForm.get('activeDate');
  }

  get expiredDate() {
    return this.onlineAdvertDefinitionForm.get('expiredDate');
  }

  get description() {
    return this.onlineAdvertDefinitionForm.get('description');
  }

  get increaseValueScore() {
    return this.onlineAdvertDefinitionForm.get('increaseValueScore');
  }

  get decreaseValueScore() {
    return this.onlineAdvertDefinitionForm.get('decreaseValueScore');
  }
  get isActive() {
    return this.onlineAdvertDefinitionForm.get('isActive');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    public sidemenuService: SidemenuService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.offcanvasModeDetection(window.innerWidth);
    this.getAdvertismentTypeTree();
    this.onlineAdvertDefinitionForm = new FormGroup({
      advertisementTypeId: new FormControl(
        this.createOnlineAdvertDefinitionModel.advertisementTypeId,
        Validators.required
      ),
      activeDate: new FormControl(
        this.createOnlineAdvertDefinitionModel.activeDate,
        Validators.required
      ),
      expiredDate: new FormControl(
        this.createOnlineAdvertDefinitionModel.expiredDate,
        Validators.required
      ),
      description: new FormControl(
        this.createOnlineAdvertDefinitionModel.description,
        Validators.required
      ),
      increaseValueScore: new FormControl(
        this.createOnlineAdvertDefinitionModel.increaseValueScore,
        Validators.required
      ),
      decreaseValueScore: new FormControl(
        this.createOnlineAdvertDefinitionModel.decreaseValueScore,
        Validators.required
      ),
      isActive: new FormControl(true, Validators.required),
    });
  }

  getAdvertismentTypeTree() {
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
      .subscribe(advertismentTypes => (this.nodes = advertismentTypes));
  }
  onNodeSelect() {
    const tmp = this.onlineAdvertDefinitionForm.get(
      'advertisementTypeId'
    )?.value;
    this.getAdvertismentTypeFileNeeds(tmp?.key);
  }

  getAdvertismentTypeFileNeeds(GID: number) {
    this.loading = true;

    this.httpService
      .get<AdvertismentTypeFileNeeds[]>(
        AdvertismentTypeFileNeeds.apiAddress + `/List/${GID}`
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return; //[new AdvertismentTypeFileNeeds()];
        })
      )
      .subscribe(advertismentTypeFileNeeds => {
        this.needs = advertismentTypeFileNeeds;
      });
  }
  private offcanvasModeDetection(innerWidth: number) {
    if (innerWidth < 991) this.sidemenuService.offcanvasMode = true;
    else this.sidemenuService.offcanvasMode = false;
  }

  onSubmit() {
    this.createOnlineAdvertDefinition();
  }

  createOnlineAdvertDefinition() {
    this.onlineAdvertDefinitionFormSubmitted = true;
    if (this.onlineAdvertDefinitionForm.valid) {
      this.onlineAdvertDefinitionFormLoading = true;
      this.loading = true;
      const {
        advertisementTypeId,
        activeDate,
        expiredDate,
        description,
        increaseValueScore,
        decreaseValueScore,
        isActive,
      } = this.onlineAdvertDefinitionForm.value;
      activeDate;
      const request = new CreateOnlineAdvertDefinition();
      request.description = description;
      request.activeDate = this.jDateCalculatorService.convertToGeorgian(
        activeDate?.getFullYear(),
        activeDate?.getMonth(),
        activeDate?.getDate()
      );
      request.expiredDate = this.jDateCalculatorService.convertToGeorgian(
        expiredDate?.getFullYear(),
        expiredDate?.getMonth(),
        expiredDate?.getDate()
      );
      request.increaseValueScore = increaseValueScore;
      request.decreaseValueScore = decreaseValueScore;
      request.isActive = isActive;
      request.advertisementTypeId = advertisementTypeId?.key;
      request.onlineAdvertNeedsInfos = this.needs;

      this.httpService
        .post<CreateOnlineAdvertDefinition>(
          UrlBuilder.build(CreateOnlineAdvertDefinition.apiAddress, 'CREATE'),
          request
        )
        .pipe(
          tap(() => {
            this.onlineAdvertDefinitionFormLoading = false;
            this.loading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'onlineAdvertDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعیه برخط`,
              summary: 'با موفقیت درج شد',
            });
          }
        });
    }
  }

  onRowEditInit(need: AdvertismentTypeFileNeeds) {
    // debugger;
    // this.clonedNeeds[need.adverTyeFileNeedsId] = { ...need };
  }

  // onRowEditSave(need: AdvertismentTypeFileNeeds) {}

  onRowEditCancel(need: AdvertismentTypeFileNeeds, index: number) {
    // this.needs[index] = this.clonedNeeds[need.adverTyeFileNeedsId];
    // delete this.clonedNeeds[need.adverTyeFileNeedsId];
  }
}
