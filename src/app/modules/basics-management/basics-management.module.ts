import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { BasicsManagementRoutingModule } from './basics-management-routing.module';
import { BasicsManagementComponent } from './basics-management.component';
import { SubjectDefinitionComponent } from './subject-definition/subject-definition.component';
import { BasicsDefinitionComponent } from './basics-definition/basics-definition.component';
import { CompanyDefinitionComponent } from './company-definition/company-definition.component';

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
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
  declarations: [
    BasicsManagementComponent,
    SubjectDefinitionComponent,
    BasicsDefinitionComponent,
    CompanyDefinitionComponent,
  ],
  imports: [
    CommonModule,
    BasicsManagementRoutingModule,
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
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TreeSelectModule,
  ],
})
export class BasicsManagementModule {}
