import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

import { authGuard } from '@core/guards/auth/auth.guard';

import { OnlineAdvertReportComponent } from './online-advert-report/online-advert-report.component';
import { AdvertDelayAndDefectReportComponent } from './advert-delay-and-defect-report/advert-delay-and-defect-report.component';
import { ApprovalAdvertsReportComponent } from './approval-adverts-report/approval-adverts-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'OnlineAdvertReport',
            component: OnlineAdvertReportComponent,
            title: 'کدال | گزارش کلی اطلاعیه های برخط',
            data: {
              reuse: true,
              title: 'گزارش کلی اطلاعیه های برخط',
              animation: 'OnlineAdvertReportPage',
            },
          },
          {
            path: 'AdvertDelayAndDefectReport',
            component: AdvertDelayAndDefectReportComponent,
            title: 'کدال | گزارش نواقص و تاخیر اطلاعیه برخط',
            data: {
              reuse: true,
              title: 'گزارش نواقص و تاخیر اطلاعیه برخط',
              animation: 'AdvertDelayAndDefectReportPage',
            },
          },
          {
            path: 'AdvertsByOnlineAdverIdReport',
            component: ApprovalAdvertsReportComponent,
            title: 'کدال | گزارش اطلاعیه های ثبت شده',
            data: {
              reuse: true,
              title: 'گزارش اطلاعیه های ثبت شده',
              animation: 'ApprovalAdvertsReportPage',
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
