import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginViewComponent {
  // #region Component output
  @Output() formSubmitted = new EventEmitter<object>();
  // #endregion Component output

  public formGroup: FormGroup = this.builder.group({
    username: this.builder.control(
      undefined,
      Validators.compose([Validators.maxLength(190), Validators.required])
    ),
    password: this.builder.control(
      undefined,
      Validators.compose([
        Validators.required,
        Validators.pattern(/((?=[a-zA-Z]*)(?=d*)(?=[~!@#$%^&*()/-_]*).{4,})/),
      ])
    ),
  });

  @ViewChild("loginForm") loginForm!: NgForm;
  @Input() performingAction: boolean = false;
  @Input() loggedIn: boolean = false;
  @Input() module = "App Name";
  @Input() company = "Company Name";
  @Input() description = "";
  @Input() service = "";
  @Input() logoAssetPath = "...";
  @Input() hasRememberMe!: boolean;

  /**
   * Component object instance initializer
   * @param builder
   */
  constructor(private builder: FormBuilder) {}

  onFormSubmit(formGroup: FormGroup) {
    // Mark componentFormGroup controls as touched
    this.validateFormGroupFields(formGroup);
    // Check if the formGroup is valid
    if (formGroup.valid) {
      // Fire formSubmitted event with the formGroup value
      this.formSubmitted.emit(formGroup.getRawValue());
    }
  }

  private validateFormGroupFields(control: FormGroup | FormArray): void {
    Object.keys(control.controls).forEach((field: string) => {
      if (control.get(field) instanceof FormGroup) {
        this.validateFormGroupFields(control.get(field) as FormGroup);
      } else {
        this.markControlAsTouched(control.get(field) || undefined);
      }
    });
  }

  private markControlAsTouched(control?: AbstractControl): void {
    if (control) {
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
      control?.markAsPristine({ onlySelf: true });
    }
  }
}
