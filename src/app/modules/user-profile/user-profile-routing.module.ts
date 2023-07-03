import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';

import { authGuard } from '@core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          //   {
          //     path: 'createuser',
          //     component: UserDefinitionComponent,
          //     title: 'کدال | تعریف کاربران',
          //     data: {
          //       reuse: true,
          //       title: 'تعریف کاربران',
          //       animation: 'UserDefinitionPage',
          //     },
          //   },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
