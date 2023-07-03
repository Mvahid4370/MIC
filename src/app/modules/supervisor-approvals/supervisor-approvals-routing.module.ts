import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupervisorApprovalsComponent } from './supervisor-approvals.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { MyApprovalsComponent } from './my-approvals/my-approvals.component';
import { ConfirmationDefinitionComponent } from './confirmation-definition/confirmation-definition.component';

const routes: Routes = [
  {
    path: '',
    component: SupervisorApprovalsComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'search',
            component: MyApprovalsComponent,
            title: 'کدال | تاییدات من',
            data: {
              reuse: true,
              title: 'تاییدات من',
              animation: 'MyApprovalsPage',
            },
          },
          {
            path: 'list',
            component: ConfirmationDefinitionComponent,
            title: 'کدال | تایید اطلاعیه',
            data: {
              reuse: true,
              title: 'تایید اطلاعیه',
              animation: 'ConfirmationDefinitionPage',
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
export class SupervisorApprovalsRoutingModule {}
