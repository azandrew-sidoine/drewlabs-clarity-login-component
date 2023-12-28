import { Inject, Pipe, PipeTransform } from "@angular/core";
import { AuthServiceInterface, SignInResultInterface } from "../../../types";
import { AUTH_SERVICE } from "../../../constants";
import { filter, map } from "rxjs";

@Pipe({
  name: "authCallbackUrl",
  pure: true,
})
export class AuthCallbackUrlPipe implements PipeTransform {
  // Pipe constructor
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {}

  // Create an observable that resolve the auth callback url
  transform(url: string) {
    return this.auth.signInState$.pipe(
      filter((state) => typeof state !== "undefined" && state !== null),
      filter(
        (state) =>
          typeof state?.authToken !== "undefined" && state.authToken !== null
      ),
      map((state) => state as SignInResultInterface),
      map(({ authToken }) => `${url}/auth/callback?token=${authToken ?? ""}`)
    );
  }
}
