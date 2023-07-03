/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Permission,
  Role,
  RolePermissions,
  UrlBuilder,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-permission-role-assignment',
  templateUrl: './permission-role-assignment.component.html',
  styleUrls: ['./permission-role-assignment.component.scss'],
})
export class PermissionRoleAssignmentComponent implements OnInit {
  /** نقش‌ها  */
  roles: Role[] = [];
  /** نقش انتخاب شده */
  selectedRole = new Role();

  /** سطح‌های دسترسی */
  permissions!: RolePermissions[];
  /** سطح‌های دسترسی انتخاب شده */
  selectedPermissions: RolePermissions[] = [];

  loading = false;

  assertionLoading = false;

  permissionIdList: number[] = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
  }

  /*--------------------------
  # Role
  --------------------------*/
  getRoles() {
    this.httpService.get<Role[]>(Role.apiAddress).subscribe(response => {
      if (response.data.result && response.data.result.length) {
        this.roles = response.data.result;
        this.selectedRole = response.data.result[0];
      }
    });
  }

  /*--------------------------
  # Permissions
  --------------------------*/
  getPermissions(roleId = 1) {
    if (roleId) {
      this.loading = true;

      this.httpService
        .get<RolePermissions[]>(RolePermissions.apiAddress + `/${roleId}`)
        .pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.result) {
              const permissions = response.data.result;

              this.selectedPermissions = [];
              this.permissionIdList = [];

              permissions.forEach(permission => {
                if (permission.hasPermission)
                  this.selectedPermissions.push(permission);

                if (this.checkHasPermission(permission)) {
                  const temp = Object.assign({}, permission);
                  delete temp.children;
                  this.selectedPermissions.push(temp);
                }

                if (permission.children?.length)
                  permission.children.forEach(child => {
                    if (child.hasPermission) {
                      this.selectedPermissions.push(child);
                    }
                  });
              });

              this.selectedPermissions.forEach(permission =>
                this.addPermission(permission)
              );

              return response.data.result;
            } else return [new RolePermissions()];
          })
        )
        .subscribe(permissions => (this.permissions = permissions));
    }
  }

  /*--------------------------
  # Create
  --------------------------*/
  assignPermissionsToRole(roleId: number, permissionIdList: number[]) {
    if (roleId) {
      this.assertionLoading = true;

      this.httpService
        .post<Permission>(UrlBuilder.build(Permission.apiAddress, 'UPDATE'), {
          roleId: roleId,
          permissions: this.getUnique(permissionIdList),
        })
        .pipe(
          tap(() => {
            this.assertionLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'permissionRoleAssignment',
              life: 8000,
              severity: 'success',
              detail: `مجوز`,
              summary: 'با موفقیت تخصیص داده شد',
            });

            this.getPermissions(roleId);
          }
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

  checkHasPermission(permission: RolePermissions): boolean {
    if (permission.hasPermission) return true;
    else if (
      permission.children &&
      permission.children.some(child => child.hasPermission)
    )
      return true;
    else return false;
  }

  addPermission(event: RolePermissions) {
    this.permissionIdList.push(event.id);

    if (event.children) {
      event.children.forEach(child => this.addPermission(child));
    }
  }

  removePermission(event: RolePermissions) {
    let i = this.permissionIdList.length;

    while (i--) {
      this.permissionIdList[i] === event.id &&
        this.permissionIdList.splice(i, 1);
    }

    if (event.children) {
      event.children.forEach(child => this.removePermission(child));
    }
  }
}
