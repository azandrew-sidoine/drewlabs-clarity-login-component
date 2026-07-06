import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, Input, Optional as NgOptional, signal as createSignal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UIMetadata } from "../type";
import { AUTH_METADATA } from "../providers";
import { Optional, SignalType } from "./types";
import { COMMON_PIPES } from "@azlabsjs/ngx-common";
import { OTPComponent } from "../otp";

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, OTPComponent, ...COMMON_PIPES],
    selector: 'ngx-login-password-forgot',
    templateUrl: './password-forgot.component.html',
    styleUrls: ['./password-forgot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordForgot {

    private _logo: Optional<string>;
    @Input() set logo(value: string | undefined | null) {
        if (value) {
            this._logo = value;
        }
    }
    get logo() {
        return this._logo;
    }

    private _description: Optional<string>;
    @Input() set description(value: string | undefined | null) {
        if (value) {
            this._description = value;
        }
    }
    get description() {
        return this._description;
    }

    private _name: Optional<string>;
    @Input() set name(value: string | undefined | null) {
        if (value) {
            this._name = value;
        }
    }
    get name() {
        return this._name;
    }

    private _size = 6;
    @Input() set size(value: Optional<number>) {
        if (value) {
            this._size = value;
        }
    }
    get size() {
        return this._size;
    }

    private _minlength = 8;
    @Input() set minlength(value: Optional<number>) {
        if (value) {
            this._minlength = value;
        }
    }
    get minlength() {
        return this._minlength;
    }


    protected username = new FormControl(null, Validators.compose([Validators.required]));
    protected password = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(this._minlength)]));
    protected passwordConfirmation = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(this._minlength)]));

    protected signal = createSignal<SignalType>({ performingAction: false, requestedPasswordReset: false, completed: false, otp: { value: null, valid: true, verified: false } });

    constructor(@Inject(AUTH_METADATA) @NgOptional() metadata: UIMetadata | null) {
        if (metadata) {
            this._name = metadata.name;
            this._logo = metadata.logo;
            this._description = metadata.description;
        }
    }

    requestPasswordReset() {
        this.username.markAllAsTouched();
        this.username.markAsDirty();
        this.username.updateValueAndValidity();

        if (!this.username.valid) {
            console.error(`username input is not valid.`);
            return;
        }

        this.signal.update(state => ({ ...state, performingAction: true }));

        console.log('requesting password reset...');
        setTimeout(() => {
            console.log('request password reset completed!');
            this.signal.update((state) => ({ ...state, performingAction: false, requestedPasswordReset: true }));
        }, 3000);
    }

    protected handleOTPChange(e: unknown) {
        if (e && typeof e === 'string' && String(e).length === 6) {
            this.signal.update((value) => ({
                ...value,
                otp: { ...value.otp, value: String(e) },
            }));
        }
    }

    protected validateOTP(value: Optional<string>) {
        this.signal.update(state => ({ ...state, performingAction: true }));

        console.log('validating otp...');
        setTimeout(() => {
            console.log('otp validated successfully!');
            this.signal.update((state) => ({ ...state, performingAction: false, otp: { ...state.otp, valid: true, verified: true } }));
        }, 3000);
    }

    resetPassword() {
        this.password.markAllAsTouched();
        this.password.markAsDirty();
        this.password.updateValueAndValidity();


        this.passwordConfirmation.markAllAsTouched();
        this.passwordConfirmation.markAsDirty();
        this.passwordConfirmation.updateValueAndValidity();


        if (!this.password.valid) {
            return;
        }

        if (!this.passwordConfirmation.valid) {
            return;
        }

        if (this.password.value !== this.passwordConfirmation.value) {
            // TODO: show error message
            return;
        }

        this.signal.update(state => ({ ...state, performingAction: true }));
        console.log('resetting password please wait...');
        setTimeout(() => {
            console.log('password reset completed successfully!');
            this.signal.update((state) => ({ ...state, performingAction: false, completed: true }));
        }, 3000);
    }

}