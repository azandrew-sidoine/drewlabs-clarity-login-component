import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { OTPDirective } from "./otp.directive";
import { NewArrayPipe } from "./pipes";

/** @internal */
function deequal(l: any[], r: any[]): boolean {
  if (l.length !== r.length) {
    return false;
  }
  let equals = true;
  for (let i = 0; i < l.length; i++) {
    if (Array.isArray(l[i]) && Array.isArray(r[i])) {
      equals = deequal(l[i], r[i]);
    } else {
      equals = l[i] === r[i];
    }

    if (equals === false) {
      break;
    }
  }

  return equals;
}

@Component({
  standalone: true,
  selector: "ngx-otp-input",
  imports: [CommonModule, OTPDirective, NewArrayPipe],
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OTPComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OTPComponent implements ControlValueAccessor {
  private _size: number = 4;
  get size() {
    return this._size;
  }
  private _disabled: boolean = false;
  get disabled() {
    return this._disabled;
  }
  private _internal: string[] = [...Array(this._size).fill("")];
  private _onChange: (...p: unknown[]) => void = () => {};
  private _onTouched: (...p: unknown[]) => void = () => {};

  // #region Component inputs
  @Input() set size(value: number) {
    // We force the OTP input to be between 4 and 6 inputs
    this._size = Math.max(4, Math.min(6, value));
    this._internal = [...Array(this._size).fill("")];
    if (value < 4 || value > 6) {
      console.error(
        `OTP input size must be between 4 and 6, falling back to ${this._size}`
      );
    }
  }
  @Input() error: boolean = false;
  @Input() updates: "blur" | "change" = "change";
  @Input() set disabled(value: boolean) {
    this._disabled = value;
  }
  // #endregion Component inputs

  // #region Component outputs
  @Output() valueChange = new EventEmitter<string>();
  // #region Component outputs

  /** @description OTP input component class constructor */
  constructor(private cdRef: ChangeDetectorRef | null) {}

  /** @description Handle changes at each otp input */
  handleValueChangeEvent(index: number, value: string) {
    this._internal[index] = value;

    const { updates } = this;
    if (updates === "change") {
      return this.valueChange.emit(this._internal.join(""));
    }
    const result = this._internal.filter(
      (v) => typeof v !== "undefined" && v !== null && v.trim() !== ""
    );

    if (updates === "blur" && deequal(result, this._internal)) {
      return this.valueChange.emit(this._internal.join(""));
    }
  }

  writeValue(obj: any): void {
    const values = String(obj).split("");
    // TODO: Set value for each input at the given index
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cdRef?.markForCheck();
  }
}
