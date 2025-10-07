import { Directive, ElementRef, Inject, OnDestroy } from "@angular/core";
import { AuthServiceInterface } from "../../types";
import { AUTH_SERVICE } from "../../core";
import { filter, map, tap } from "rxjs";

@Directive({
  standalone: true,
  selector: "[username]",
})
export class UsernameDirective implements OnDestroy {
  subscription = this.auth.signInState$
    .pipe(
      filter((state) => typeof state !== "undefined" && state !== null),
      filter(
        (state) =>
          (typeof state?.name !== "undefined" && state.name !== null) ||
          (typeof state?.firstName !== "undefined" &&
            state.firstName !== null &&
            typeof state?.lastName !== "undefined" &&
            state.lastName !== null)
      ),
      map((state) =>
        state?.name
          ? `${state.name}`
          : state?.firstName && state.lastName
          ? `${state.firstName} ${state.lastName}`
          : ""
      ),
      tap((value) => {
        if (value) {
          (this.element.nativeElement as Element).innerHTML = value;
        }
      })
    )
    .subscribe();

  constructor(
    private element: ElementRef,
    @Inject(AUTH_SERVICE) private auth: AuthServiceInterface
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
