import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth.guard';
import { AccountModule } from './modules/account/account.module';

import { MainComponent } from './core/main/main.component';
import { PageNotFoundComponent } from './core/layout/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    title: 'کدال',
    data: { animation: 'mainPage' },
    children: [
      // {
      //   path: 'account',
      //   title: 'کدال | ورود',
      //   loadChildren: () => AccountModule,
      // },
      {
        path: 'default',
        title: 'کدال | صفحه اصلی',
        loadChildren: () =>
          import('../app/modules/home/home.module').then(
            module => module.HomeModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'usermanagement',
        title: 'کدال | مدیریت کاربران',
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then(
            m => m.UserManagementModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'baseinfo',
        title: 'کدال | مدیریت اطلاعات پایه',
        loadChildren: () =>
          import('./modules/basics-management/basics-management.module').then(
            m => m.BasicsManagementModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'Publisher',
        title: 'کدال | مدیریت تاییدات',
        loadChildren: () =>
          import(
            './modules/confirmation-management/confirmation-management.module'
          ).then(m => m.ConfirmationManagementModule),
        canMatch: [authGuard],
      },
      {
        path: 'AdvertSettings',
        title: 'کدال | تنظیمات پایه اطلاعیه',
        loadChildren: () =>
          import('./modules/advert-settings/advert-settings.module').then(
            m => m.AdvertSettingsModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'Supervisor',
        title: 'کدال | ناظر',
        loadChildren: () =>
          import(
            './modules/supervisor-approvals/supervisor-approvals.module'
          ).then(m => m.SupervisorApprovalsModule),
        canMatch: [authGuard],
      },
      {
        path: 'Report',
        title: 'کدال | گزارشات سیستم',
        loadChildren: () =>
          import('./modules/reports/reports.module').then(m => m.ReportsModule),
        canMatch: [authGuard],
      },

      { path: '', redirectTo: '/default/adrvers', pathMatch: 'full' },
    ],
  },
  {
    path: 'account',
    title: 'کدال | ورود',
    loadChildren: () => AccountModule,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
