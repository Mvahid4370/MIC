/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicsManagementComponent } from './basics-management.component';

import { authGuard } from '@core/guards/auth/auth.guard';

import { SubjectDefinitionComponent } from './subject-definition/subject-definition.component';
import { BasicsDefinitionComponent } from './basics-definition/basics-definition.component';
import { CompanyDefinitionComponent } from './company-definition/company-definition.component';

const routes: Routes = [
  {
    path: '',
    component: BasicsManagementComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'createmasters',
            component: SubjectDefinitionComponent,
            title: 'کدال | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'createslaves',
            component: BasicsDefinitionComponent,
            title: 'کدال | تعریف اطلاعات پایه',
            data: {
              reuse: true,
              title: 'تعریف اطلاعات پایه',
              animation: 'BasicsDefinitionPage',
            },
          },
          {
            path: 'createcompany',
            component: CompanyDefinitionComponent,
            title: 'کدال | تعریف اطلاعات شرکت‌ها',
            data: {
              reuse: true,
              title: 'تعریف اطلاعات شرکت‌ها',
              animation: 'CompanyDefinitionPage',
            },
          },

          {
            path: '',
            redirectTo: '/baseinfo/createmasters',
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
export class BasicsManagementRoutingModule {}
