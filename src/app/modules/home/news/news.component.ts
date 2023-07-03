/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit, AfterViewChecked, ElementRef } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { news } from '@shared/models/response.model';

@Component({
  selector: 'marketwatch-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, AfterViewChecked {
  newsList: news[] = [];

  constructor(private httpService: HttpService, private el: ElementRef) {}

  ngOnInit(): void {
    this.getNewsLst();
  }

  ngAfterViewChecked() {
    Array.from(this.el.nativeElement.querySelectorAll('a')).forEach(
      (el: any) => {
        el.setAttribute('target', '_blank');
      }
    );
  }

  getNewsLst() {
    this.httpService.get<news[]>(news.apiAddress).subscribe(response => {
      if (response.data.result) {
        this.newsList = response.data.result;
      }
    });
  }
}
