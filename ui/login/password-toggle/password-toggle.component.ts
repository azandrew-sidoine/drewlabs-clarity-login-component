import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  //   ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

/** @internal */
type StateType = "text" | "password";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "app-password-toggle",
  templateUrl: "./password-toggle.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordToggleComponent {
  // #region Component inputs
  private _state: StateType = "text";
  @Input() set state(value: StateType) {
    this._state = value;
  }
  get state() {
    return this._state;
  }
  @Input() size: number = 24;
  // #endregion Component inputs

  // #region Component outputs
  @Output() stateChange = new EventEmitter<StateType>();
  // #endregion Component outputs

  /** @description password toggle component contructor */
  //   constructor(private cdRef: ChangeDetectorRef | null) {}

  onToggle(state: StateType) {
    console.log("On Toggle....", state);
    this._state = state;
    this.stateChange.emit(state);
  }
}
