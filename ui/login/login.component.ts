import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  Input,
  Injector,
  Optional,
} from "@angular/core";
import { Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { Subject, firstValueFrom } from "rxjs";
import { AuthServiceInterface } from "../../types";
import { AuthActions, AuthStrategies } from "../../constants";
import { AUTH_SERVICE, AuthService } from "../../core";
import { LoginViewComponent } from "./login-view.component";
import { CommonModule } from "@angular/common";
import { AUTH_METADATA } from "../providers";
import { UIMetadata } from "../type";
import { PASSWORD_RESET, PasswordResetProvider } from "../password-forgot";

@Component({
  standalone: true,
  imports: [CommonModule, LoginViewComponent],
  selector: "ngx-login",
  template: `
    <ngx-login-view
      [performingAction]="(performingAction$ | async) || false"
      (formSubmitted)="handleSubmit($event)"
      (loadRegistrationViewEvent)="router.navigateByUrl('/register')"
      [name]="name"
      [company]="company"
      [description]="description"
      [logo]="logo"
      [remember]="remember"
      [can-reset-password]="!!passwords"
    ></ngx-login-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  public readonly router = this.injector.get(Router);

  private _logo = this.metadata?.logo;
  @Input() set logo(value: string | undefined | null) {
    if (value) {
      this._logo = value;
    }
  }
  get logo() {
    return this._logo;
  }

  private _company = this.metadata?.company;
  @Input() set company(value: string | undefined | null) {
    if (value) {
      this._company = value;
    }
  }
  get company() {
    return this._company;
  }

  private _description = this.metadata?.description;
  @Input() set description(value: string | undefined | null) {
    if (value) {
      this._description = value;
    }
  }
  get description() {
    return this._description;
  }

  private _name = this.metadata?.name;
  @Input() set name(value: string | undefined | null) {
    if (value) {
      this._name = value;
    }
  }
  get name() {
    return this._name;
  }

  private _remember = this.metadata?.remember ?? false;
  @Input() set remember(value: boolean | undefined | null) {
    if (typeof value !== "undefined" && value !== null) {
      this._remember = value;
    }
  }
  get remember(): boolean {
    return this._remember;
  }

  performingAction$ = (this.auth as AuthService)?.actionsState$.pipe(
    map((state) => {
      switch (state) {
        case AuthActions.COMPLETE:
        case AuthActions.FAILED:
          return false;
        case AuthActions.ONGOING:
          return true;
        default:
          return false;
      }
    })
  );


  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    public readonly injector: Injector,
    @Inject(AUTH_METADATA) @Optional() private metadata: UIMetadata | null,
    @Optional() @Inject(PASSWORD_RESET) public readonly passwords: PasswordResetProvider | null,
  ) {
    this.auth.signInState$
      .pipe(
        tap((state) => {
          if (state) {
            const { dashboard } = this.metadata ?? {};
            setTimeout(() => {
              if (typeof dashboard === "function" && dashboard !== null) {
                return dashboard(this.injector, state);
              }
              return this.router.navigateByUrl(`/${dashboard}`);
            }, 300);
          }
        })
      )
      .subscribe();
  }

  // tslint:disable-next-line: typedef
  async handleSubmit(event: { [index: string]: any }) {
    await firstValueFrom(this.auth.signIn(AuthStrategies.LOCAL, event));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
