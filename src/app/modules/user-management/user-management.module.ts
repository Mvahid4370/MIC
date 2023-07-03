import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserDefinitionComponent } from './user-definition/user-definition.component';
import { RoleDefinitionComponent } from './role-definition/role-definition.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { PermissionRoleAssignmentComponent } from './permission-role-assignment/permission-role-assignment.component';
import { UserPermissionAssignmentComponent } from './user-permission-assignment/user-permission-assignment.component';

/* PrimeNG */
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeModule } from 'primeng/tree';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserDefinitionComponent,
    RoleDefinitionComponent,
    UserRoleAssignmentComponent,
    PermissionRoleAssignmentComponent,
    UserPermissionAssignmentComponent,
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    PasswordModule,
    InputTextareaModule,
    TreeModule,
    BlockUIModule,
    ToastModule,
    ConfirmDialogModule,
  ],
})
export class UserManagementModule {}
