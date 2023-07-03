/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { ConfirmationManagementRoutingModule } from './confirmation-management-routing.module';
import { ConfirmationManagementComponent } from './confirmation-management.component';
import { NotificationDefinitionComponent } from './notification-definition/notification-definition.component';
import { ModalOnlineAdvertListComponent } from './notification-definition/mdl-online-advert-lst/mdl-online-advert-lst.component';
import { MyadvertismentsComponent } from './myadvertisments/myadvertisments.component';
import { ActiveOnlineAdvertsComponent } from './active-online-adverts/active-online-adverts.component';

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
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    ConfirmationManagementComponent,
    NotificationDefinitionComponent,
    MyadvertismentsComponent,
    ModalOnlineAdvertListComponent,
    ActiveOnlineAdvertsComponent,
  ],
  imports: [
    CommonModule,
    ConfirmationManagementRoutingModule,
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
    FileUploadModule,
    DialogModule,
    ToastModule,
  ],
  providers: [FileUpload],
})
export class ConfirmationManagementModule {}
