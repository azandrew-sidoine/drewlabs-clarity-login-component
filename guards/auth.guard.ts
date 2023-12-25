import { Inject, Injectable, OnDestroy, Optional } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, Subject, interval } from "rxjs";
import { first, map, takeUntil, tap } from "rxjs/operators";
import { AUTH_SERVICE } from "../constants";
import { AuthServiceInterface, SignInResultInterface } from "../types";
import { tokenCan, tokenCanAny } from "../core/helpers";
import { DOCUMENT } from "@angular/common";
import { useAuthenticationResult } from "./helpers";
import { REDIRECT_URL } from "../providers";
// import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements OnDestroy {
  // tslint:disable-next-line: variable-name
  private _destroy$ = new Subject<void>();
  private _signedIn = false;
  private window!: Window | null;

  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    @Inject(DOCUMENT) document: Document,
    private router: Router,
    // private location: Location,
    @Optional() @Inject(REDIRECT_URL) private redirectTo: string = "/login"
  ) {
    const { defaultView } = document;
    this.window = defaultView ?? window;
    this.auth.signInState$
      .pipe(
        takeUntil(this._destroy$),
        tap((state) => {
          this._signedIn = state ? true : false;
        })
      )
      .subscribe();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthStatus(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  canLoad(route: Route) {
    return this.checkAuthStatus(`/${route.path}`);
  }

  checkAuthStatus(url: string) {
    // Simulating a timeout for signin result to be available
    return interval(300).pipe(
      first(),
      map(() =>
        useAuthenticationResult(this._signedIn, this.redirectTo)(
          this.router,
          // this.location,
          this.window ?? window
        )
      )
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}

@Injectable({
  providedIn: "root",
})
export class TokenCanGuard {
  // #region Class properties
  private _destroy$ = new Subject<void>();
  private _signInResult!: Required<SignInResultInterface>;
  // #endregion Class properties

  /**
   * Creates new class instance
   *
   * @param router
   * @param auth
   */
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {
    this.auth.signInState$
      .pipe(
        takeUntil(this._destroy$),
        tap(
          (state) =>
            (this._signInResult = {
              ...state,
              scopes: state?.scopes ?? [],
            } as Required<SignInResultInterface>)
        )
      )
      .subscribe();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.can(next.data["authorizations"] ?? next.data["scopes"], url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const url = `/${route.path}`;
    return this.can(
      route.data ? route.data["authorizations"] ?? route.data["scopes"] : [],
      url
    );
  }

  private can(scopes: string[] | string, url: string) {
    if (
      typeof this._signInResult === "undefined" ||
      this._signInResult === null
    ) {
      return false;
    }
    const _scopes = typeof scopes === "string" ? [scopes] : scopes;
    return tokenCan(this._signInResult, ..._scopes);
  }
}

@Injectable({
  providedIn: "root",
})
export class TokenCanAnyGuard {
  // #region Class properties
  private _destroy$ = new Subject<void>();
  private _signInResult!: Required<SignInResultInterface>;
  // #endregion Class properties

  /**
   * Creates new class instance
   *
   * @param router
   * @param auth
   */
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {
    this.auth.signInState$
      .pipe(
        takeUntil(this._destroy$),
        tap(
          (state) =>
            (this._signInResult = {
              ...state,
              scopes: state?.scopes ?? [],
            } as Required<SignInResultInterface>)
        )
      )
      .subscribe();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.can(next.data["authorizations"] ?? next.data["scopes"], url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const url = `/${route.path}`;
    return this.can(
      route.data ? route.data["authorizations"] ?? route.data["scopes"] : [],
      url
    );
  }

  private can(scopes: string[] | string, url: string) {
    if (
      typeof this._signInResult === "undefined" ||
      this._signInResult === null
    ) {
      return false;
    }
    const _scopes = typeof scopes === "string" ? [scopes] : scopes;
    return tokenCanAny(this._signInResult, ..._scopes);
  }
}
