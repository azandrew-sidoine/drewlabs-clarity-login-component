import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  Input,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { lastValueFrom, Subject } from "rxjs";
import { AuthServiceInterface } from "./contracts";
import { AuthActions, AuthStrategies, AUTH_SERVICE } from "./constants";
import { AuthService } from "./core/auth.service";

@Component({
  selector: "app-login",
  template: `
    <app-login-view
      [performingAction]="(performingAction$ | async) ?? false"
      (formSubmitted)="onChildComponentFormSubmitted($event)"
      (loadRegistrationViewEvent)="router.navigateByUrl('/register')"
      [moduleName]="moduleName"
      [logoAssetPath]="logoAssetPath"
    ></app-login-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  // Properties definitions
  private destroy$ = new Subject<void>();

  // View text declarations
  @Input() moduleName = this.route.snapshot.data.moduleName;
  loginHeadingText = this.route.snapshot.data.loginHeadingText;
  @Input() logoAssetPath = this.route.snapshot.data.logoAssetPath;
  @Input() hasRememberMe = this.route.snapshot.data.hasRememberMe ?? false;

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
    public route: ActivatedRoute,
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    public readonly router: Router
  ) {
    this.auth.signInState$
      .pipe(
        tap((state) => {
          console.log(state);
          // TODO : CHECK IF USER HAS ABILITIES
          if (state) {
            // TODO : NAVIGATE TO THE APPLICATION DASHBOARD
            setTimeout(() => {
              this.router.navigateByUrl(`/${this.route.snapshot.data.path}`);
            }, 300);
          }
        })
      )
      .subscribe();
  }

  // tslint:disable-next-line: typedef
  async onChildComponentFormSubmitted(event: { [index: string]: any }) {
    await lastValueFrom(this.auth.signIn(AuthStrategies.LOCAL, event));
  }

  ngOnDestroy = () => this.destroy$.next();
}
