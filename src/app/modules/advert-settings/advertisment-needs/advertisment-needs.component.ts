import { Component, OnInit } from '@angular/core';
import { SidemenuService } from '@core/layout/sidemenu/sidemenu.service';
import { HttpService } from '@core/http/http.service';
import {
  AdvertismentType,
  AdvertismentTypeFileNeeds,
  UrlBuilder,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-advertisment-needs',
  templateUrl: './advertisment-needs.component.html',
  styleUrls: ['./advertisment-needs.component.scss'],
  providers: [],
})
export class AdvertismentNeedsComponent implements OnInit {
  selectedNodes: any;
  nodes: any;
  needs: any;
  selectedNeeds: any[] = [];

  advertismentTypes: AdvertismentType[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  onSubmitLoading = false;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    public sidemenuService: SidemenuService
  ) {}

  ngOnInit(): void {
    this.offcanvasModeDetection(window.innerWidth);
    this.getAdvertismentTypeTree();
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
    this.getAdvertismentTypeFileNeeds(this.selectedNodes?.key);
  }

  getAdvertismentTypeFileNeeds(GID: number) {
    this.loading = true;

    this.httpService
      .get<AdvertismentTypeFileNeeds[]>(
        AdvertismentTypeFileNeeds.apiAddress + `/ListCheck/${GID}`
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data) return response.data;
          else return [new AdvertismentTypeFileNeeds()];
        })
      )
      .subscribe(advertismentTypeFileNeeds => {
        this.needs = advertismentTypeFileNeeds;
        this.selectedNeeds = this.needs.filter((need: any) => need.isAdded);
      });
  }
  private offcanvasModeDetection(innerWidth: number) {
    if (innerWidth < 991) this.sidemenuService.offcanvasMode = true;
    else this.sidemenuService.offcanvasMode = false;
  }

  onSubmit() {
    this.onSubmitLoading = true;
    const selectedIds: any = [];
    this.selectedNeeds.map(item => {
      selectedIds.push(item.id);
    });
    this.getAddAdvertismentTypeFileNeeds(selectedIds);
  }

  getAddAdvertismentTypeFileNeeds(selectedIds: any) {
    this.loading = true;
    const request = {
      advertisementTypeId: this.selectedNodes?.key,
      attachmentFileTypeIds: selectedIds,
    };
    this.httpService
      .post<AdvertismentTypeFileNeeds>(
        UrlBuilder.build(AdvertismentTypeFileNeeds.apiAddress, 'ADD'),
        request
      )
      .pipe(
        tap(() => {
          this.onSubmitLoading = false;
          this.loading = false;
        })
      )
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'advertismentNeeds',
            life: 8000,
            severity: 'success',
            detail: `نیازمندی اطلاعیه`,
            summary: 'با موفقیت درج شد',
          });
        }
      });
  }
}
