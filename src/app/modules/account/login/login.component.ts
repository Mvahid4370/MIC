import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { tap } from 'rxjs';

import { SidemenuService } from '@core/layout/sidemenu/sidemenu.service';
import { PersianNumberService } from '@shared/services/persian-number.service';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';

import { Permission, Account } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { DntCaptchaComponent } from './dnt-captcha/dnt-captcha.component';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@core/services/app-config.service';
import { LoginForm } from './login-form';

class LoginModel {
  username = '';
  password = '';
  rememberMe = false;
}

@Component({
  selector: 'marketwatch-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /** store the URL so we can redirect after logging in. */
  public redirectUrl: string | null = null;
  public loading = false;
  public submitted = false;
  captchaData: any;
  captchaApiUrl =
    this.config.getAddress('baseUrl') + Account.apiAddress + '/GetDNTCaptcha';

  // Form group:
  public loginForm!: FormGroup;
  public loginModel = new LoginModel();
  public errMsg = '';
  model = new LoginForm('', '');

  // Form group fields:
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  @ViewChild('appDntCaptcha') appDntCaptcha!: DntCaptchaComponent;

  constructor(
    private config: AppConfigService,
    public authService: AuthService,
    public router: Router,
    public themeService: ThemeService,
    public sidemenuService: SidemenuService,
    private httpService: HttpService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.GetDNTCaptcha();
    this.offcanvasModeDetection(window.innerWidth);
    this.loginForm = new FormGroup({
      username: new FormControl(this.loginModel.username, Validators.required),
      password: new FormControl(this.loginModel.password, [
        Validators.required,
        Validators.minLength(8),
      ]),
      rememberMe: new FormControl(this.loginModel.rememberMe),
    });
  }

  /** Log in user */
  public signin(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      const { username, password, rememberMe } = this.loginForm.value;
      this.model.username = PersianNumberService.toEnglish(username);
      this.model.password = password;
      const data = new FormData();
      data.append('DNT_CaptchaInputText', this.model.DNTCaptchaInputText);
      data.append('DNT_CaptchaText', this.model.DNTCaptchaText);
      data.append('DNT_CaptchaToken', this.model.DNTCaptchaToken);
      data.append('password', this.model.password);
      data.append('username', this.model.username);

      this.loading = true;
      this.http
        .post<any>(
          this.config.getAddress('baseUrl') + Account.apiAddress + '/login',
          data,
          { withCredentials: true }
        )
        .subscribe(
          response => {
            this.loading = false;
            if (response.successed && response.data && response.data.result)
              sessionStorage.setItem(
                'loginData',
                JSON.stringify(response.data.result)
              );
            if (response.successed && response.data && response.data.token) {
              // Use the redirect URL from the auth service.
              const redirectUrl = this.authService.redirectUrl || '';

              // Set our navigation extras object
              // that passes on our global query params and fragment
              const navigationExtras: NavigationExtras = {
                queryParamsHandling: 'preserve',
                preserveFragment: true,
              };

              this.saveLoginInfo(rememberMe, response.data.token);
              this.appDntCaptcha.doRefresh();
              // Fetch menu
              this.httpService
                .get<Permission[]>(Permission.apiAddress)
                .pipe(
                  tap(() => {
                    this.loading = false;
                  })
                )
                .subscribe(menuResponse => {
                  if (
                    menuResponse.successed &&
                    menuResponse.data &&
                    menuResponse.data.result
                  ) {
                    this.saveMenuItems(rememberMe, menuResponse.data.result);

                    // Redirect the user
                    this.router.navigate([redirectUrl], navigationExtras);
                  }
                });
            }
            this.appDntCaptcha.doRefresh();
          },
          error => {
            this.loading = false;
            if (error.error.message) this.errMsg = error.error.message;
            if (error.error.resultMessage)
              this.errMsg = error.error.resultMessage;
            this.appDntCaptcha.doRefresh();
          }
        );
    }
  }

  /**
   * ذخیره اطلاعات لاگین
   * @param rememberMe تورو یادمون بمونه ؟
   * @param loginInfo اطلاعات لاگین
   */
  private saveLoginInfo(rememberMe: boolean, token: string) {
    if (rememberMe) localStorage.setItem('TOKEN', token || '');
    else sessionStorage.setItem('TOKEN', token || '');
  }

  /**
   * ذخیره اطلاعات منو
   * @param rememberMe تورو یادمون بمونه ؟
   * @param loginInfo اطلاعات لاگین
   */
  private saveMenuItems(rememberMe: boolean, menuItems: Permission[]) {
    if (rememberMe) {
      localStorage.setItem('MENU', JSON.stringify(menuItems));
    } else {
      sessionStorage.setItem('MENU', JSON.stringify(menuItems));
    }

    this.sidemenuService.menuItems.next(menuItems);
  }

  private offcanvasModeDetection(innerWidth: number) {
    if (innerWidth < 991) this.sidemenuService.offcanvasMode = true;
    else this.sidemenuService.offcanvasMode = false;
  }

  GetDNTCaptcha() {
    this.httpService
      .get<Account>(Account.apiAddress + '/GetDNTCaptcha')
      .subscribe(captchaData => (this.captchaData = captchaData));
  }
}
