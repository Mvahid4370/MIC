/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationManagementComponent } from './confirmation-management.component';

import { authGuard } from '@core/guards/auth/auth.guard';
import { NotificationDefinitionComponent } from './notification-definition/notification-definition.component';
import { MyadvertismentsComponent } from './myadvertisments/myadvertisments.component';
import { ActiveOnlineAdvertsComponent } from './active-online-adverts/active-online-adverts.component';

const routes: Routes = [
  {
    path: '',
    component: ConfirmationManagementComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'MyAdvert',
            component: MyadvertismentsComponent,
            title: 'کدال | اطلاعیه‌های من',
            data: {
              reuse: true,
              title: 'اطلاعیه‌های من',
              animation: 'ConfirmationDefinitionPage',
            },
          },
          {
            path: 'AddAdvert',
            component: NotificationDefinitionComponent,
            title: 'کدال | تعریف اطلاعیه',
            data: {
              reuse: true,
              title: 'تعریف اطلاعیه',
              animation: 'NotificationDefinitionPage',
            },
          },
          {
            path: 'OnlineAdvert',
            component: ActiveOnlineAdvertsComponent,
            title: 'کدال | اطلاعیه های برخط فعال',
            data: {
              reuse: true,
              title: 'اطلاعیه های برخط فعال',
              animation: 'ActiveOnlineAdvertsPage',
            },
          },
          {
            path: '',
            redirectTo: '/registerandconfirms/RegisterAdvert',
            pathMatch: 'full',
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
export class ConfirmationManagementRoutingModule {}
