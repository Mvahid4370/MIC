import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  UrlBuilder,
  CreateOnlineAdvertDefinition,
  Publisher,
} from '@shared/models/response.model';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-mdl-online-advert-lst',
  templateUrl: './mdl-online-advert-lst.component.html',
  styles: [``],
})
export class ModalOnlineAdvertListComponent implements OnInit {
  @Output() Hide: EventEmitter<any> = new EventEmitter();
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  onlineAdvertisment: CreateOnlineAdvertDefinition[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  selectedRow = new CreateOnlineAdvertDefinition();

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.getOnlineAdvertisment();
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get onlineAdvertisment from server. */
  getOnlineAdvertisment() {
    this.loading = true;

    this.httpService
      .get<CreateOnlineAdvertDefinition[]>(
        UrlBuilder.build(Publisher.apiAddress + '/OnlineAdvert', '')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new CreateOnlineAdvertDefinition()];
        })
      )
      .subscribe(
        onlineAdvertisment => (this.onlineAdvertisment = onlineAdvertisment)
      );
  }

  onSubmit() {
    console.log(this.selectedRow);
    this.Hide.emit(this.selectedRow);
  }
}
