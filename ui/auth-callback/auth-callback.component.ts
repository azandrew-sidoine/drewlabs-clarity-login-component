import { Component, Inject, Injector, OnDestroy } from "@angular/core";
import { AuthServiceInterface } from "../../types";
import { AUTH_SERVICE, AuthStrategies } from "../../constants";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, lastValueFrom, mergeMap, tap, timer } from "rxjs";

@Component({
  selector: "auth-callback",
  templateUrl: "./auth-callback.component.html",
})
export class AuthCallbackComponent implements OnDestroy {
  // #region Component properties
  private data = this.route.snapshot.data;
  private subscription = this.route.queryParamMap
    .pipe(
      tap(async (state) => {
        const authToken = state.get("token");
        if (authToken) {
          return await lastValueFrom(
            this.auth.refreshSignInState(authToken, AuthStrategies.LOCAL)
          );
        }
        return this.router.navigateByUrl(`/`);
      })
    )
    .subscribe();
  private authSubscription = this.auth.signInState$
    .pipe(
      filter(
        (state) =>
          typeof state?.authToken !== "undefined" && state?.authToken !== null
      ),
      mergeMap((state) =>
        timer(1000).pipe(
          tap(() => {
            const { data } = this;
            if (state && data["path"]) {
              if (typeof data["path"] === "function" && data["path"] !== null) {
                return data["path"](this.injector, state);
              }
              return this.router.navigateByUrl(data["path"] ?? `/`);
            }
          })
        )
      )
    )
    .subscribe();
  // #endregion Component properties

  // Class constructor
  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface,
    private route: ActivatedRoute,
    private router: Router,
    public readonly injector: Injector
  ) {}

  // Unsubscribe from any component subscriptions
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
