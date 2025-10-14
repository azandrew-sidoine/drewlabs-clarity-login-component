import {
  Directive,
  EventEmitter,
  HostListener,
  Inject,
  Output,
} from "@angular/core";
import { AuthServiceInterface } from "../../types";
import { AUTH_SERVICE } from "../../core";
import { lastValueFrom } from "rxjs";

@Directive({
  standalone: true,
  selector: "[logout]",
})
export class LogoutDirective {
  @HostListener("click") async onClick() {
    try {
      this.performingAction.emit(true);
      await lastValueFrom(this.auth.signOut(true).pipe());
      this.performingAction.emit(false);
    } catch (error) {
      console.error("Logout error: ", error);
      this.performingAction.emit(false);
    }
  }

  @Output("performing-action") performingAction = new EventEmitter<boolean>();

  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {}
}
