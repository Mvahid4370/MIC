/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from 'src/app/core/guards/auth/auth.guard';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { CompaniesComponent } from './companies/companies.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'dashboard',
            title: 'کدال | صفحه کاری',
            component: DashboardComponent,
            data: { title: 'صفحه کاری', animation: 'dashboardPage' },
          },
          {
            path: 'home',
            component: ReportsComponent,
            title: 'کدال | اطلاعیه‌ها',
            data: {
              reuse: true,
              title: 'اطلاعیه‌ها',
              animation: 'NotificationsPage',
            },
          },
          {
            path: 'adrvers',
            component: ReportsComponent,
            title: 'کدال | اطلاعیه‌ها',
            data: {
              reuse: true,
              title: 'اطلاعیه‌ها',
              animation: 'NotificationsPage',
            },
          },
          {
            path: 'publishers',
            component: CompaniesComponent,
            title: 'کدال | ناشران',
            data: {
              reuse: true,
              title: 'ناشران',
              animation: 'CompaniesPage',
            },
          },
          {
            path: 'news',
            component: NewsComponent,
            title: 'کدال | اخبار',
            data: {
              reuse: true,
              title: 'اخبار',
              animation: 'NewsPage',
            },
          },
          {
            path: 'aboutus',
            component: AboutComponent,
            title: 'کدال | درباره ما',
            data: {
              reuse: true,
              title: 'درباره ما',
              animation: 'AboutPage',
            },
          },
          {
            path: 'contactus',
            component: ContactComponent,
            title: 'کدال | ارتباط با ما',
            data: {
              reuse: true,
              title: 'ارتباط با ما',
              animation: 'ContactPage',
            },
          },

          { path: '', redirectTo: '/default/adrvers', pathMatch: 'full' },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
