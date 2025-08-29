import { CommonModule } from "@angular/common";
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
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { COMMON_PIPES } from "@azlabsjs/ngx-common";
import { ClarityModule } from "@clr/angular";
import { PasswordToggleComponent } from "./password-toggle";
import { PasswordInputDirective } from "./password-input.directive";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ...COMMON_PIPES,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    PasswordToggleComponent,
    PasswordInputDirective,
  ],
  selector: "app-login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.scss"],
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
  @ViewChild(PasswordInputDirective, { static: false })
  passwordInputRef!: PasswordInputDirective | null;
  @Input() performingAction: boolean = false;
  @Input() loggedIn: boolean = false;
  @Input() name: string | null | undefined;
  @Input() company: string | null | undefined = "Company Name";
  @Input() description: string | null | undefined = "";
  @Input() logo: string | null | undefined = "...";
  @Input() remember!: boolean;

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
