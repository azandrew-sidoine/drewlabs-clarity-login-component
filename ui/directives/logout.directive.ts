import {
  Directive,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
} from "@angular/core";
import { AuthServiceInterface } from "../../types";
import { AUTH_SERVICE } from "../../core";
import { lastValueFrom } from "rxjs";
import { Dialog, DIALOG } from "../../../directives/dialog";

@Directive({
  standalone: true,
  selector: "[logout]",
})
export class LogoutDirective {

  @HostListener("click") async onClick() { this.doLogout(); }

  @Input() prompt!: string;
  @Input() revoke: boolean = true;
  
  @Output("performing-action") performingAction = new EventEmitter<boolean>();

  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface, @Inject(DIALOG) private dialog: Dialog) { }

  private async doLogout() {
    if (this.prompt && this.dialog) {
      const result = await this.dialog.confirm(this.prompt);
      if (result === false) {
        return;
      }
    }

    try {
      this.performingAction.emit(true);
      await lastValueFrom(this.auth.signOut(this.revoke));
    } catch (error) {
      console.error("[Logout] ", error);
    } finally {
      this.performingAction.emit(false);
    }
  }
}
