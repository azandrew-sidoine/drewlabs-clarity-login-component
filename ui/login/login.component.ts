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
import { AuthActions, AuthStrategies, AUTH_SERVICE } from "../../constants";
import { AuthService } from "../../core";
import { LoginViewComponent } from "./login-view.component";
import { CommonModule } from "@angular/common";
import { UI_METADATA } from "../providers";
import { UIMetadata } from "../type";

@Component({
  standalone: true,
  imports: [CommonModule, LoginViewComponent],
  selector: "app-login",
  template: `
    <app-login-view
      [performingAction]="(performingAction$ | async) || false"
      (formSubmitted)="handleSubmit($event)"
      (loadRegistrationViewEvent)="router.navigateByUrl('/register')"
      [name]="name"
      [company]="company"
      [description]="description"
      [logo]="logo"
      [remember]="remember"
    ></app-login-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  // Properties definitions
  private destroy$ = new Subject<void>();
  public readonly router = this.injector.get(Router);
  // private data: { [index: string]: any } = this.route.snapshot.data;
  // View text declarations

  // #region Component inputs
  @Input() logo!: string | null | undefined;
  @Input() company!: string | null | undefined;
  @Input() description!: string | null | undefined;
  @Input() name!: string | null | undefined;
  @Input() remember!: boolean;
  // #region Component inputs

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

  // Class constructor
  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    public readonly injector: Injector,
    @Inject(UI_METADATA) @Optional() metadata?: UIMetadata | null
  ) {
    // #region Set Login component properties
    const m = metadata ?? ({} as UIMetadata);
    const { dashboard, remember, logo, name, description, company } = m;
    this.remember = remember ?? false;
    this.logo = logo;
    this.name = name;
    this.description = description;
    this.company = company;
    // #endregion  Set Login component properties

    this.auth.signInState$
      .pipe(
        tap((state) => {
          // TODO : CHECK IF USER HAS ABILITIES
          if (state) {
            // TODO : NAVIGATE TO THE APPLICATION DASHBOARD
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
