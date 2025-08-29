import { Observable } from "rxjs";
import { SignInOptionsType, SignInResultInterface } from "./signin";

/** @description auth strategies type declaration */
export interface StrategyInterface {
  /** @description SignIn result of the strategy */
  signInState$: Observable<SignInResultInterface | null>;

  /** @description Initialization function which is invoked by the auth service to load any cached authentication state */
  initialize(autologin?: boolean): Promise<void> | Observable<void> | void;

  /** @description Returns the login or sign in state of the application */
  getLoginStatus(): Promise<SignInResultInterface | null>;

  /** @description Sign in user using the provided options */
  signIn(options?: SignInOptionsType): Observable<boolean>;

  /** @description Sign out or logout user from application */
  signOut(revoke?: boolean): Observable<boolean>;

  /** @description Refresh application user signin state */
  refreshSignInState(authToken: string, expiresAt?: number): Observable<boolean>;
}
