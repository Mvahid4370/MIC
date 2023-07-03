import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertSettingsComponent } from './advert-settings.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { FileTypeDefinitionComponent } from './file-type-definition/file-type-definition.component';
import { AttachmentTypeDefinitionComponent } from './attachment-type-definition/attachment-type-definition.component';
import { AdvertismentTypeDefinitionComponent } from './advertisment-type-definition/advertisment-type-definition.component';
import { AdvertismentNeedsComponent } from './advertisment-needs/advertisment-needs.component';
import { OnlineAdvertDefinitionComponent } from './online-advert-definition/online-advert-definition.component';

const routes: Routes = [
  {
    path: '',
    component: AdvertSettingsComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'FileMimeType',
            component: FileTypeDefinitionComponent,
            title: 'کدال | تعریف نوع فایل',
            data: {
              reuse: true,
              title: 'تعریف نوع فایل',
              animation: 'FileTypeDefinitionPage',
            },
          },
          {
            path: 'AttachmentFileType',
            component: AttachmentTypeDefinitionComponent,
            title: 'کدال | تعریف نوع پیوست',
            data: {
              reuse: true,
              title: 'تعریف نوع پیوست',
              animation: 'AttachmentTypeDefinitionPage',
            },
          },
          {
            path: 'AdvertismentType',
            component: AdvertismentTypeDefinitionComponent,
            title: 'کدال | تعریف انواع اطلاعیه',
            data: {
              reuse: true,
              title: 'تعریف انواع اطلاعیه',
              animation: 'AdvertismentTypeDefinitionPage',
            },
          },
          {
            path: 'AdverTyeFileNeeds',
            component: AdvertismentNeedsComponent,
            title: 'کدال | نیازمندی های اطلاعیه',
            data: {
              reuse: true,
              title: 'نیازمندی های اطلاعیه',
              animation: 'AdvertismentNeeds',
            },
          },
          {
            path: 'OnlineAdvertDefinition',
            component: OnlineAdvertDefinitionComponent,
            title: 'کدال | اطلاعیه برخط',
            data: {
              reuse: true,
              title: 'اطلاعیه برخط',
              animation: 'OnlineAdvertDefinitionPage',
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
export class AdvertSettingsRoutingModule {}
