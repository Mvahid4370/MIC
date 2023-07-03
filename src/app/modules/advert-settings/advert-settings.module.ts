import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AdvertSettingsRoutingModule } from './advert-settings-routing.module';
import { AdvertSettingsComponent } from './advert-settings.component';
import { FileTypeDefinitionComponent } from './file-type-definition/file-type-definition.component';
import { AttachmentTypeDefinitionComponent } from './attachment-type-definition/attachment-type-definition.component';
import { AdvertismentTypeDefinitionComponent } from './advertisment-type-definition/advertisment-type-definition.component';
import { AdvertismentNeedsComponent } from './advertisment-needs/advertisment-needs.component';
import { OnlineAdvertDefinitionComponent } from './online-advert-definition/online-advert-definition.component';

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
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    AdvertSettingsComponent,
    FileTypeDefinitionComponent,
    AttachmentTypeDefinitionComponent,
    AdvertismentTypeDefinitionComponent,
    AdvertismentNeedsComponent,
    OnlineAdvertDefinitionComponent,
  ],
  imports: [
    CommonModule,
    AdvertSettingsRoutingModule,
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
    CheckboxModule,
    InputNumberModule,
  ],
  providers: [TableModule],
})
export class AdvertSettingsModule {}
