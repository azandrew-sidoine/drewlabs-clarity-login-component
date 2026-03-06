import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthServiceInterface } from '../../types';
import { AuthStrategies } from '../../constants';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  filter,
  lastValueFrom,
  map,
  mergeMap,
  of,
  Subscription,
  tap,
  throwError,
  timer,
  withLatestFrom,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { AUTH_SERVICE } from '../../core';
import { HttpErrorResponse } from '@angular/common/http';
import { Optional } from './types';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'auth-callback',
  templateUrl: './callback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private _token!: string;
  @Input() set token(value: string) {
    if (value) {
      this._token = value;
    }
  }

  private _redirect!: { 200: string; 403: string };
  @Input() set redirect(value: Optional<{ 200: string; 403: string }>) {
    if (
      value &&
      typeof value === 'object' &&
      '200' in value &&
      '403' in value
    ) {
      this._redirect = value;
    }
  }

  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    private route: ActivatedRoute,
    private router: Router,
    public readonly injector: Injector,
  ) {
    const redirect = this._redirect
      ? of(this._redirect['200'])
      : this.route.data.pipe(
          map((data) => ('path' in data ? data['path'] : null)),
        );

    const subscription = this.auth.signInState$
      .pipe(
        filter(
          (state) =>
            typeof state?.authToken !== 'undefined' &&
            state?.authToken !== null,
        ),
        withLatestFrom(redirect),
        mergeMap(([state, data]) =>
          timer(1000).pipe(map(() => ({ state, data }))),
        ),
      )
      .subscribe(({ state, data }) => {
        if (!(state && data)) {
          return;
        }

        if (typeof data === 'function' && data !== null) {
          return data(this.injector, state);
        }

        return this.router.navigateByUrl(data ?? `/`);
      });

    this.subscriptions = [subscription];
  }

  async ngOnInit() {
    const tokenParam$ = this._token
      ? of(this._token)
      : this.route.queryParamMap.pipe(map((param) => param.get('token')));

    const observable$ = tokenParam$.pipe(
      mergeMap((authToken) =>
        authToken
          ? this.auth.refreshSignInState(authToken, AuthStrategies.LOCAL).pipe(
              catchError((err) => {
                if (
                  err instanceof HttpErrorResponse &&
                  Number(err.status) === 401
                ) {
                  return of(false);
                }
                return throwError(() => err);
              }),
            )
          : of(false),
      ),
      tap((result) => {
        if (!result) {
          const redirect = this._redirect ? this._redirect['403'] : '/';
          this.router.navigateByUrl(redirect);
        }
      }),
    );
    await lastValueFrom(observable$);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
