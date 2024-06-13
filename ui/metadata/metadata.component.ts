import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { AUTH_SERVICE } from "../../constants";
import { AuthServiceInterface } from "../../types";
import { filter, map } from "rxjs";
import { CommonModule } from "@angular/common";
import { SubstrPipe } from "./pipes";

@Component({
  standalone: true,
  imports: [CommonModule, SubstrPipe],
  selector: "ngx-user-metadata",
  templateUrl: "./metadata.component.html",
  styleUrls: ["./metadata.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent {
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
