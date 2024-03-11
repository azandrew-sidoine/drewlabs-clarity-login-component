import { Inject, Pipe, PipeTransform } from "@angular/core";
import {
  AuthServiceInterface,
  RequiredProp,
  SignInResultInterface,
} from "../../types";
import { tokenCanAny } from "../../core";
import { AUTH_SERVICE } from "../../constants";
import { map } from "rxjs";

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
   *
   * @param value
   * @param scopes
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
