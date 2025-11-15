import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnDestroy,
} from "@angular/core";
import { AuthServiceInterface } from "../../types";
import { AuthStrategies } from "../../constants";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
  filter,
  lastValueFrom,
  mergeMap,
  tap,
  timer,
  withLatestFrom,
} from "rxjs";
import { CommonModule, Location } from "@angular/common";
import { AUTH_SERVICE } from "../../core";

// @internal
function bytes() {
  // generate 16 random bytes
  const byteArray = new Uint8Array(16);
  window.crypto.getRandomValues(byteArray);

  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "auth-callback",
  templateUrl: "./callback.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackComponent implements OnDestroy {
  private subscriptions = [
    this.route.queryParamMap
      .pipe(
        tap(async (state) => {
          let path = this.location.path(true);
          const redirect = state.get('redirect') ?? this.route.snapshot.data["redirect"] ?? "/";
          const index = path.indexOf("?");

          if (index !== -1) {
            path = path.substring(0, index);
          }
          const authToken = state.get("token");
          if (authToken) {
            if (window && window.sessionStorage && window.crypto) {
              const challenge = bytes();
              window.sessionStorage.setItem(
                challenge,
                JSON.stringify(authToken)
              );
              const extras = {
                queryParams: { challenge, redirect },
                queryParamsHandling: "replace",
              } as NavigationExtras;

              return this.router.navigate(path.split("/"), extras);
            }

            return this.refreshAuth(
              authToken,
              () => {
                this.router.navigateByUrl(redirect);
              },
              (err) => {
                console.error(err);
              }
            );
          }

          const challenge = state.get("challenge");
          if (challenge && typeof challenge === "string") {
            if (window && window.sessionStorage) {
              const authToken = window.sessionStorage.getItem(challenge);
              if (!authToken) {
                return this.router.navigateByUrl(`/`);
              }

              // remove challenge key from the session storage
              window.sessionStorage.removeItem(challenge);

              // refresh the authentication signin state
              return this.refreshAuth(
                JSON.parse(authToken),
                () => {
                  this.router.navigateByUrl(redirect);
                },
                (err) => {
                  console.error(err);
                }
              );
            }
          }
          return this.router.navigateByUrl(`/`);
        })
      )
      .subscribe(),
    this.auth.signInState$
      .pipe(
        withLatestFrom(this.route.data),
        filter(
          ([state]) =>
            typeof state?.authToken !== "undefined" && state?.authToken !== null
        ),
        mergeMap(([state, data]) =>
          timer(1000).pipe(
            tap(() => {
              if (state && data["path"]) {
                if (
                  typeof data["path"] === "function" &&
                  data["path"] !== null
                ) {
                  return data["path"](this.injector, state);
                }
                return this.router.navigateByUrl(data["path"] ?? `/`);
              }
            })
          )
        )
      )
      .subscribe(),
  ];

  // class constructor
  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public readonly injector: Injector
  ) {}

  private async refreshAuth(
    authToken: string,
    then: () => void,
    error: (err: unknown) => void
  ) {
    try {
      await lastValueFrom(
        this.auth.refreshSignInState(authToken, AuthStrategies.LOCAL)
      );
      then();
    } catch (err) {
      error(err);
    }
  }

  // unsubscribe from any component subscriptions
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
