import { Component, Inject } from "@angular/core";
import { AUTH_SERVICE } from "../../../constants";
import { AuthServiceInterface } from "../../../types";
import { filter, map } from "rxjs";

@Component({
  selector: "ngx-user-metadata",
  templateUrl: "./user-metadata.component.html",
  styleUrls: ["./user-metadata.component.scss"],
})
export class UserMetadaComponent {
  state$ = this.auth.signInState$.pipe(
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
    )
  );

  // Class constructor
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {}
}
