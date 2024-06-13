import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";

/** @internal */
type StateType = "text" | "password";

@Directive({
  standalone: true,
  selector: "[password]",
})
export class PasswordInputDirective implements AfterViewInit {
  private _type: StateType = "password";
  @Input() set type(value: StateType) {
    this._type = value;
  }

  /** @description Directive constructor */
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    (this.el.nativeElement as HTMLInputElement).type = this._type;
  }

  /** Set the type attribute of the directive element */
  setTypeAttribute(value: "text" | "password") {
    this._type = value;
    (this.el.nativeElement as HTMLInputElement).type = value;
  }

  getTypeAttribute() {
    return this._type;
  }
}
