import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { finalize, map, mergeMap } from "rxjs/operators";
import {
  DoubleAuthSignInResultInterface,
  SignInOptionsType,
  SignInResult,
  SignInResultInterface,
  StrategyInterface,
  UnAuthenticatedResultInterface,
} from "../../../types";
import { LOCAL_SIGNIN_RESULT_CACHE } from "./defaults";
import { AuthResultCallbackType, SingInResultType } from "./types";
import { UserResolver, SignInRequestHandler, UserInterface } from "./auth";
import { mergeUserMedata } from "./helpers";

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
  // Properties definition
  private _signInState$ = new BehaviorSubject<SingInResultType>(null);
  signInState$ = this._signInState$.asObservable();
  private _request2FaConsent$ = new Subject<string>();
  request2FaConsent$ = this._request2FaConsent$.asObservable();

  // Instance initializer
  constructor(
    private userResolver: UserResolver,
    private signInHandler: SignInRequestHandler,
    private cache?: Storage,
    private driver: string = "default",
    private authResultCallback?: AuthResultCallbackType,
    private userResultCallback?: (result: UserInterface) => void
  ) {}

  initialize(autologin?: boolean): Observable<void> {
    // TODO : If Auto-login is true, load the signIn result from the cache storage
    // And publish a signInResult event
    return of();
  }

  getLoginStatus() {
    return new Promise<SingInResultType>((resolve) => {
      if (this.cache) {
        const value = this.cache.getItem(LOCAL_SIGNIN_RESULT_CACHE) as any;
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

  refreshSignInState(authToken: string) {
    return this.userResolver.user(authToken).pipe(
      map((user) => {
        // Case strategy user provides a user result callback, we invoke
        // the user result callback with the resolved user
        if (this.userResultCallback) {
          this.userResultCallback.bind(this)(user);
        }
        const result = mergeUserMedata(
          { ...user.accessToken, authToken },
          user
        );
        this._signInState$.next(result);
        if (this.cache) {
          this.cache.setItem(LOCAL_SIGNIN_RESULT_CACHE, JSON.stringify(result));
        }
        return true;
      })
    );
  }

  signIn(options?: SignInOptionsType) {
    const _options = options ?? {};
    // Added driver parameter to the authentication options
    return this.signInHandler
      .sendRequest({
        ..._options,
        driver: this.driver,
      })
      .pipe(
        mergeMap((state: SignInResult) => {
          let authState: SignInResult =
            state as DoubleAuthSignInResultInterface;
          if (authState.is2faEnabled) {
            this._request2FaConsent$.next(authState.auth2faToken);
            return of(true);
          }
          authState = state as UnAuthenticatedResultInterface;
          if (Boolean(authState.locked)) {
            return of(false);
          }
          const authenticated = authState.authenticated;
          if (
            !(null === authenticated || typeof authenticated === "undefined") &&
            Boolean(authenticated) === false
          ) {
            return of(false);
          }

          const _state = state as Partial<SignInResultInterface>;
          const authToken = _state.authToken;

          if (typeof authToken === "undefined" || authToken === null) {
            return of(false);
          }

          // Case the auth result callback is provided, we it on the auth result state
          // and case the `authResultCallback` returns false, we drop from the execution context
          if (this.authResultCallback) {
            const result = this.authResultCallback.bind(this)(_state);

            // Case the callback return false, we drop from the execution context
            if (result === false) {
              return of(false);
            }
          }

          return this.userResolver.user(authToken).pipe(
            map((user: UserInterface) => {
              // Case strategy user provides a user result callback, we invoke
              // the user result callback with the resolved user
              if (this.userResultCallback) {
                this.userResultCallback.bind(this)(user);
              }

              if (_state) {
                const result = mergeUserMedata(_state, user);
                this._signInState$.next(result);
                if (this.cache) {
                  this.cache.setItem(
                    LOCAL_SIGNIN_RESULT_CACHE,
                    JSON.stringify(result)
                  );
                }
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
        // Cleanup the resources to prevent user from auto login next time
        this._signInState$.next(null);
        this.cache?.removeItem(LOCAL_SIGNIN_RESULT_CACHE);
      })
    );
  }
}
