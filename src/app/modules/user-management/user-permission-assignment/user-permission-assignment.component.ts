/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  AssignCompanyToSupervisor,
  CompanyTree,
  Supervisor,
} from '@shared/models/response.model';

import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

export class UserPermissionAssignment {
  userId!: number;
  /** نام */
  firstName!: string;
  /** نام خانوادگی */
  lastName!: string;
  /** کد ملی */
  nationalCode!: string;
}

@Component({
  selector: 'marketwatch-user-permission-assignment',
  templateUrl: './user-permission-assignment.component.html',
  styleUrls: ['./user-permission-assignment.component.scss'],
})
export class UserPermissionAssignmentComponent implements OnInit {
  /** کاربرها  */
  supervisors: Supervisor[] = [];
  /** کاربر انتخاب شده */
  selectedSupervisor = new Supervisor();

  /** نام */
  firstName!: string;

  /** نام خانوادگی */
  lastName!: string;

  /** کد ملی */
  nationalCode!: string;

  /** سطح‌های دسترسی */
  permissions!: CompanyTree[];
  /** سطح‌های دسترسی انتخاب شده */
  selectedPermissions!: CompanyTree[];

  loading = false;

  assertionLoading = false;

  permissionIdList: number[] = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getSupervisors();
    this.getCompanyTree();
  }

  /*--------------------------
  # ReportingType
  --------------------------*/
  getSupervisors() {
    this.httpService
      .get<Supervisor[]>(Supervisor.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.supervisors = response.data.result;
        }
      });
  }

  /*--------------------------
  # Permissions
  --------------------------*/
  getChilds(currentPermission: CompanyTree) {
    if (currentPermission.hasPermission) {
      this.selectedPermissions.push(currentPermission);
      const temp = Object.assign({}, currentPermission);
      // delete temp.children;
      this.selectedPermissions.push(temp);
    }
    if (currentPermission.children) {
      if (currentPermission.children?.length > 0) {
        currentPermission.children?.forEach(x => this.getChilds(x));
      }
    } else {
      return;
    }
  }

  getCompanyTree(userId = 1) {
    if (userId) {
      this.loading = true;

      this.httpService
        .get<CompanyTree[]>(CompanyTree.apiAddress + `/${userId}`)
        .pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.result) {
              const permissions = response.data.result;

              this.selectedPermissions = [];
              this.permissionIdList = [];

              permissions.forEach(permission => {
                this.getChilds(permission);

                // if (permission.hasPermission)
                //   this.selectedPermissions.push(permission);

                // if (this.checkHasPermission(permission)) {
                //   const temp = Object.assign({}, permission);
                //   delete temp.children;
                //   this.selectedPermissions.push(temp);
                // }

                // if (permission.children?.length)
                //   permission.children.forEach(child => {
                //     if (child.hasPermission) {
                //       this.selectedPermissions.push(child);
                //     }
                //   });
              });

              this.selectedPermissions.forEach(permission =>
                this.addPermission(permission)
              );
              console.log(this.selectedPermissions);
              return response.data.result;
            } else return [new CompanyTree()];
          })
        )
        .subscribe(permissions => (this.permissions = permissions));
    }
  }

  /*--------------------------
  # Create
  --------------------------*/
  assignPermissionsToUser(userId: number, permissionIdList: number[]) {
    if (userId) {
      this.assertionLoading = true;

      this.httpService
        .post<AssignCompanyToSupervisor>(AssignCompanyToSupervisor.apiAddress, {
          userId: userId,
          companyIdList: this.getUnique(permissionIdList),
        })
        .pipe(
          tap(() => {
            this.assertionLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'userPermissionAssignment',
              life: 8000,
              severity: 'success',
              detail: `مجوز`,
              summary: 'با موفقیت تخصیص داده شد',
            });

            this.getCompanyTree(userId);
          }
        });
    } else {
      this.messageService.add({
        key: 'userPermissionAssignment',
        life: 8000,
        severity: 'warn',
        detail: `هشدار`,
        summary: 'ناظر انتخاب نشده است',
      });
    }
  }

  getUnique(array: number[]) {
    const uniqueArray = [];

    // Loop through array values
    for (let i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

  checkHasPermission(permission: CompanyTree): boolean {
    if (permission.hasPermission) return true;
    else if (
      permission.children &&
      permission.children.some(child => child.hasPermission)
    )
      return true;
    else return false;
  }

  addPermission(event: CompanyTree) {
    this.permissionIdList.push(event.id);

    // if (event.children) {
    //   event.children.forEach(child => this.addPermission(child));
    // }
  }

  removePermission(event: CompanyTree) {
    let i = this.permissionIdList.length;

    while (i--) {
      this.permissionIdList[i] === event.id &&
        this.permissionIdList.splice(i, 1);
    }

    // if (event.children) {
    //   event.children.forEach(child => this.removePermission(child));
    // }
  }
}
