import { Component, Inject, Injector, OnDestroy } from "@angular/core";
import { AuthServiceInterface } from "../../types";
import { AUTH_SERVICE, AuthStrategies } from "../../constants";
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom, tap } from "rxjs";

@Component({
  selector: "auth-token-callback",
  templateUrl: "./token-callback.component.html",
})
export class TokenCallbackComponent implements OnDestroy {
  // #region Component properties
  private path = this.route.snapshot.data;
  private subscription = this.route.queryParamMap
    .pipe(
      tap(async (state) => {
        const authToken = state.get("token");
        if (authToken) {
          console.log(authToken);
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
      tap((state) => {
        const { path } = this;
        if (state) {
          // TODO : NAVIGATE TO THE APPLICATION DASHBOARD
          setTimeout(() => {
            if (typeof path === "function" && path !== null) {
              return path(this.injector, state);
            }
            return this.router.navigateByUrl(`/${path}`);
          }, 1000);
        }
      })
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
