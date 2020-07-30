import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, takeUntil, withLatestFrom, tap, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TRANSLATIONS, buildLoginFormControlObj } from './constants';
import { TranslationService } from '../../domain/translator';
import { AppUIStateProvider } from '../../domain/ui-store';
import { AuthService } from '../../domain/auth/core';
import { SessionStorage } from '../../domain/storage/core';
import { UIStateStatusCode } from '../../domain/helpers/app-ui-store-manager.service';
import { observaleOf } from '../../domain/rxjs/helpers';
import { HttpRequestConfigs } from 'src/app/lib/domain/http/core';
import { isDefined } from 'src/app/lib/domain/utils';
import { doLog } from '../../domain/rxjs/operators';
import { AppUser, userCanAny } from '../../domain/auth/contracts/v2';
import { IHTMLFormControl } from 'src/app/lib/domain/components/dynamic-inputs/core';
export interface ComponentState {
  translations: { [index: string]: any };
  controlConfigs: IHTMLFormControl[];
  performingAction: boolean;
}

@Component({
  selector: 'app-login',
  template: `
    <!-- <app-login-notification [authorizations]="route.snapshot?.data?.modulePermissions"></app-login-notification> -->
    <ng-container *ngIf="loginViewState$ | async  as state">
    <app-login-view
      [controlConfigs]="state.controlConfigs"
      [performingAction]="state.performingAction"
      (formSubmitted)="onChildComponentFormSubmitted($event)"
      (loadRegistrationViewEvent)="router.navigateByUrl('/register')"
    ></app-login-view>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<{}>();

  // Load translations
  translations$ = this.translate
    .translate(TRANSLATIONS);
  loginViewState$ = this.uiState.uiState
    .pipe(
      withLatestFrom(this.translations$),
      mergeMap(([uiState, source]) => observaleOf({
        controlConfigs: buildLoginFormControlObj(source),
        performingAction: uiState.performingAction
      })),
    );
  loginState$ = this.auth.state$.pipe(
    map(state => {
      if (state.authenticating) {
        this.uiState.startAction();
      } else if (!state.isInitialState) {
        this.uiState.endAction('', state.isLoggedIn ? UIStateStatusCode.AUTHENTICATED : UIStateStatusCode.UNAUTHENTICATED);
      }
      return state;
    })
  );

  constructor(
    private translate: TranslationService,
    private uiState: AppUIStateProvider,
    public route: ActivatedRoute,
    private auth: AuthService,
    public readonly router: Router,
    cache: SessionStorage
  ) {
    // Component state observale
    // Checks for session expiration
    if (isDefined(cache.get(HttpRequestConfigs.sessionExpiredStorageKey))) {
      this.translations$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(translations => {
        this.uiState.endAction(translations.sessionExpired, UIStateStatusCode.UNAUTHORIZED);
        setTimeout(() => {
          this.uiState.endAction();
          cache.delete(HttpRequestConfigs.sessionExpiredStorageKey);
        }, 3000);
      });
    }

    // Set login state
    this.loginState$.pipe(
      takeUntil(this.destroy$),
      filter(state => !state.authenticating && isDefined(state.isInitialState)),
      doLog('Logging state in loggin component: '),
      tap(state => {
        if (state.isLoggedIn) {
          // Checks if user has permission provided to the login component
          if (!(state.user && (state.user instanceof AppUser) && isDefined(this.route.snapshot.data.modulePermissions)
            && !(userCanAny(state.user, this.route.snapshot.data.modulePermissions)))) {
            // Navigate to dashboard
            setTimeout(() => {
              this.router.navigateByUrl(`/${this.route.snapshot.data.dashboardPath}`);
            }, 1000);
          }
        }
      }),
    ).subscribe();
    // End Checks for auth expiration
  }

  async onChildComponentFormSubmitted(event: any) {
    // Start the UiState action
    this.uiState.startAction();
    await this.auth.authenticate(Object.assign({}, event)).toPromise();
  }

  ngOnDestroy = () => this.destroy$.next();
}
