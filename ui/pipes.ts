import { Inject, Pipe, PipeTransform } from "@angular/core";
import {
  AuthServiceInterface,
  RequiredProp,
  SignInResultInterface,
} from "../types";
import { AUTH_SERVICE, tokenCanAny } from "../core";
import { map } from "rxjs";
import { tokenCan } from "../core";

/**
 * Instead of using helper function `[tokenCanAny]` or rxjs operators `[tokenCanAny$]`
 * the `tokenCan` pipe can be used to check if the auth result have
 * any of the provided scopes
 */
@Pipe({
  name: "tokenCanAny",
})
export class TokenCanAnyPipe implements PipeTransform {
  // Constructor
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {}

  /**
   * {@inheritdoc}
   */
  transform(scopes: string | string[]) {
    const s = Array.isArray(scopes) ? scopes : [scopes];
    return this.auth.signInState$.pipe(
      map((value) =>
        typeof value === "undefined" || value === null
          ? false
          : tokenCanAny(
              value as RequiredProp<SignInResultInterface, "scopes">,
              ...s
            )
      )
    );
  }
}

/**
 * Instead of using helper function, or rxjs operators [tokenCan$]
 * the `tokenCan` pipe can be used to check if the auth result have
 * all provided scopes
 */
@Pipe({
  name: "tokenCan",
})
export class TokenCanPipe implements PipeTransform {
  // Constructor
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {}

  /**
   * {@inheritdoc}
   */
  transform(...scopes: string[]) {
    const s = Array.isArray(scopes) ? scopes : [scopes];
    return this.auth.signInState$.pipe(
      map((value) =>
        typeof value === "undefined" || value === null
          ? false
          : tokenCan(
              value as RequiredProp<SignInResultInterface, "scopes">,
              ...s
            )
      )
    );
  }
}
