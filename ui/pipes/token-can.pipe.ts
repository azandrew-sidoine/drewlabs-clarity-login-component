import { Inject, Pipe, PipeTransform } from "@angular/core";
import {
  AuthServiceInterface,
  RequiredProp,
  SignInResultInterface,
} from "../../types";
import { tokenCan } from "../../core";
import { AUTH_SERVICE } from "../../constants";
import { map } from "rxjs";

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
   *
   * @param value
   * @param scopes
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
