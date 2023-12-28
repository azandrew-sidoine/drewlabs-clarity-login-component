import { Observable } from "rxjs";
import { SignInOptionsType, SignInResultInterface } from "./signin";

export interface StrategyInterface {
  signInState$: Observable<SignInResultInterface | null>;

  initialize(autologin?: boolean): Promise<void> | Observable<void> | void;

  getLoginStatus(): Promise<SignInResultInterface | null>;

  signIn(options?: SignInOptionsType): Observable<boolean>;

  signOut(revoke?: boolean): Observable<boolean>;

  /**
   * Refresh auth sign in state object
   *
   * @param authToken
   */
  refreshSignInState(authToken: string): Observable<boolean>;
}
