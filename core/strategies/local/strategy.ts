import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { finalize, map, mergeMap } from "rxjs/operators";
import {
  AuthUser,
  DoubleAuthSignInResultInterface,
  SignInOptionsType,
  SignInResult,
  SignInResultInterface,
  StrategyInterface,
  TokenResult,
  UnAuthenticatedResultInterface,
} from "../../../types";
import { SIGNIN_RESULT_CACHE } from "./defaults";
import { AuthResultCallbackType, SingInResultType } from "./types";
import { UserResolver, SignInRequestHandler } from "./auth";

function is2fa(result: unknown): result is DoubleAuthSignInResultInterface {
  return (
    typeof result === "object" &&
    result !== null &&
    "is2faEnabled" in result &&
    Boolean(result.is2faEnabled)
  );
}

function unauthenticated(
  result: unknown
): result is UnAuthenticatedResultInterface {
  return (
    typeof result === "object" &&
    result !== null &&
    "locked" in result &&
    "authenticated" in result
  );
}

/**
 * Local strategy provides interface for authenticating first party
 * application users via bearer token.
 *
 * **Note**
 * Implementation flow is based on drewlabs identity web service. Provide
 * your own implementation inspired by the current implementation  if
 * using a service other that the service mention above.
 *
 * **Note**
 * By default, the strategy implementation use default routes prefixed by
 * `/auth/v2`. To change the default behavior, pass the required endpoint
 * as parameter to the constructor:
 *
 * ```ts
 *
 *
 * // Example using api/v2/ as prefix to authentication routes
 * const strategy = new LocalStrategy(client, host, {
 *    users: "api/v2/user",
 *    signIn: "api/v2/login",
 *    signOut: "api/v2/logout"
 * })
 * ```
 */
export class LocalStrategy implements StrategyInterface {
  private _signInState$ = new BehaviorSubject<SingInResultType>(null);
  signInState$ = this._signInState$.asObservable();
  private _request2FaConsent$ = new Subject<string>();
  request2FaConsent$ = this._request2FaConsent$.asObservable();

  constructor(
    private userResolver: UserResolver,
    private signInHandler: SignInRequestHandler,
    private cache?: Storage,
    private driver: string = "default",
    private authResultCallback?: AuthResultCallbackType<TokenResult>,
    private userResultCallback?: (result: AuthUser) => void
  ) {}

  initialize(autologin?: boolean): Observable<void> {
    // TODO : If Auto-login is true, load the signIn result from the cache storage and publish a signInResult event
    return of();
  }

  getLoginStatus() {
    return new Promise<SingInResultType>((resolve) => {
      if (this.cache) {
        const value = this.cache.getItem(SIGNIN_RESULT_CACHE) as any;
        if (typeof value === "undefined" || value === null) {
          return resolve(null);
        }
        if (typeof value === "string") {
          return resolve(JSON.parse(value) as SignInResultInterface);
        }
        return resolve(value);
      }
      return resolve(null);
    });
  }

  refreshSignInState(authToken: string, expiresAt?: number) {
    return this.userResolver.user(authToken).pipe(
      map((user) => {
        // case strategy user provides a user result callback, we invoke
        // the user result callback with the resolved user
        if (this.userResultCallback) {
          this.userResultCallback.bind(this)(user);
        }

        this._signInState$.next({ authToken, expiresAt, ...user });
        if (this.cache) {
          this.cache.setItem(SIGNIN_RESULT_CACHE, JSON.stringify(user));
        }
        return true;
      })
    );
  }

  signIn(options?: SignInOptionsType) {
    const _options = options ?? {};
    // added driver parameter to the authentication options
    return this.signInHandler
      .sendRequest({
        ..._options,
        driver: this.driver,
      })
      .pipe(
        mergeMap((state: SignInResult) => {
          if (is2fa(state)) {
            this._request2FaConsent$.next(state.auth2faToken);
            return of(true);
          }

          if (unauthenticated(state) && Boolean(state.locked)) {
            return of(false);
          }

          if (unauthenticated(state) && !Boolean(state.authenticated)) {
            return of(false);
          }

          const _state = state as TokenResult;
          const authToken = _state.authToken;

          if (typeof authToken === "undefined" || authToken === null) {
            return of(false);
          }

          // case the auth result callback is provided, we it on the auth result state
          // and case the `authResultCallback` returns false, we drop from the execution context
          if (this.authResultCallback) {
            const result = this.authResultCallback.bind(this)(_state);

            // case the callback return false, we drop from the execution context
            if (result === false) {
              return of(false);
            }
          }

          return this.userResolver.user(authToken).pipe(
            map((user: AuthUser) => {
              // case strategy user provides a user result callback, we invoke
              // the user result callback with the resolved user
              if (this.userResultCallback) {
                this.userResultCallback.bind(this)(user);
              }

              const result: SignInResultInterface = { ..._state, ...user };

              if (_state) {
                this._signInState$.next(result);
              }

              if (this.cache) {
                this.cache.setItem(SIGNIN_RESULT_CACHE, JSON.stringify(result));
              }

              return true;
            })
          );
        })
      );
  }

  signOut(revoke?: boolean): Observable<boolean> {
    return this.userResolver.revoke(revoke).pipe(
      map(() => true),
      finalize(() => {
        this._signInState$.next(null);
        this.cache?.removeItem(SIGNIN_RESULT_CACHE);
      })
    );
  }
}
