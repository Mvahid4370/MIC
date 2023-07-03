/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

import { authGuard } from '@core/guards/auth/auth.guard';

import { UserDefinitionComponent } from './user-definition/user-definition.component';
import { RoleDefinitionComponent } from './role-definition/role-definition.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { PermissionRoleAssignmentComponent } from './permission-role-assignment/permission-role-assignment.component';
import { UserPermissionAssignmentComponent } from './user-permission-assignment/user-permission-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'createuser',
            component: UserDefinitionComponent,
            title: 'کدال | تعریف کاربران',
            data: {
              reuse: true,
              title: 'تعریف کاربران',
              animation: 'UserDefinitionPage',
            },
          },
          {
            path: 'createrole',
            component: RoleDefinitionComponent,
            title: 'کدال | تعریف نقش',
            data: {
              reuse: true,
              title: 'تعریف نقش',
              animation: 'RoleDefinitionPage',
            },
          },
          {
            path: 'assignroletouser',
            component: UserRoleAssignmentComponent,
            title: 'کدال | تخصیص نقش به کاربر',
            data: {
              reuse: true,
              title: 'تخصیص نقش به کاربر',
              animation: 'UserRoleAssignmentPage',
            },
          },
          {
            path: 'assignpermissiontorole',
            component: PermissionRoleAssignmentComponent,
            title: 'کدال | تخصیص مجوز به نقش',
            data: {
              reuse: true,
              title: 'تخصیص مجوز به نقش',
              animation: 'PermissionRoleAssignmentPage',
            },
          },
          {
            path: 'supervisoraccesslevel',
            component: UserPermissionAssignmentComponent,
            title: 'کدال | سطح دسترسی ناظرین',
            data: {
              reuse: true,
              title: 'سطح دسترسی ناظرین',
              animation: 'UserPermissionAssignmentPage',
            },
          },

          {
            path: '',
            redirectTo: '/usermanagement/createuser',
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
export class UserManagementRoutingModule {}
