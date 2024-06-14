import { Inject, Pipe, PipeTransform } from "@angular/core";
import { AuthServiceInterface, SignInResultInterface } from "../../../types";
import { filter, map } from "rxjs";
import { AUTH_SERVICE } from "../../../core";

@Pipe({
  standalone: true,
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
      map(({ authToken }) => {
        if (url.endsWith("/")) {
          url = url.substring(0, url.length - 1);
        }
        return `${url}/auth/callback?token=${authToken ?? ""}`;
      })
    );
  }
}
