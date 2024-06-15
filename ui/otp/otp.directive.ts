import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";

@Directive({
  standalone: true,
  selector: "[otp]",
})
export class OTPDirective {
  // #region Directive inputs
  @Input({ alias: "otp", required: true }) index!: number;
  /** @description get index of the last input element */
  @Input({ required: true }) last!: number;
  // #region Directive inputs

  // #region Directive outputs
  @Output() valueChange = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();
  // #region Directive outputs

  // TODO: Add regex to support only number as input
  @HostListener("input", ["$event"]) handleInputEvent(e: InputEvent) {
    const target = e.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    const value = target?.value;

    if (isNaN(Number(value))) {
      target?.setAttribute("value", "");
      return;
    }

    // Focus the next Sibling input whenever the input value changes
    // const pattern = /[0-9\+\-\ ]/;
    // const inputChar = String.fromCharCode(event.charCode);
    // if (!pattern.test(inputChar)) {
    //   event.preventDefault();
    // }
    if (value !== "") {
      if (this.index !== this.last) {
        (target.nextElementSibling as HTMLElement)?.focus();
      }
      this.valueChange.emit(value);
    }

    e.preventDefault();
  }

  @HostListener("keyup", ["$event"]) handleKeyUpEvent(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement | null;
    if (!target) {
      return;
    }

    const key = e.key.toLowerCase();

    if (key === "backspace" || key === "delete") {
      target?.setAttribute("value", "");
      (target.previousElementSibling as HTMLElement)?.focus();
    }
    e.preventDefault();
  }
}
