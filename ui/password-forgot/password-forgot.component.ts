import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, Input, Optional as NgOptional, signal as createSignal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UIMetadata } from "../type";
import { AUTH_METADATA } from "../providers";
import { PasswordResetError, Optional, PASSWORD_RESET, PasswordResetProvider, SignalType } from "./types";
import { COMMON_PIPES } from "@azlabsjs/ngx-common";
import { OTPComponent } from "../otp";
import { lastValueFrom } from "rxjs";
import { DOCUMENT_LOCAL_STORAGE } from "@azlabsjs/ngx-storage";
import { UI_EVENTS_CONTROLLER, UIEventsControllerType } from "../../../directives/ui-events";

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

    protected username = new FormControl<string>('', Validators.compose([Validators.required]));
    protected password = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(this._minlength)]));
    protected passwordConfirmation = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(this._minlength)]));
    protected signal = createSignal<SignalType>({ performingAction: false, requestedPasswordReset: false, completed: false, user: null, otp: { value: null, valid: true, verified: false } });

    constructor(
        @NgOptional() @Inject(DOCUMENT_LOCAL_STORAGE) private storage: Storage,
        @NgOptional() @Inject(PASSWORD_RESET) private passwords: PasswordResetProvider,
        @NgOptional() @Inject(UI_EVENTS_CONTROLLER) private controller: UIEventsControllerType,
        @NgOptional() @Inject(AUTH_METADATA) metadata: UIMetadata | null) {
        if (metadata) {
            this._logo = metadata.logo;
        }
    }

    showOtpView() {
        this.password.reset();
        this.passwordConfirmation.reset();
        this.signal.update(state => ({ ...state, otp: { ...state.otp, verified: false, value: null } }));
    }

    protected async requestOTP() {
        this.username.markAllAsTouched();
        this.username.markAsDirty();
        this.username.updateValueAndValidity();

        if (!this.username.valid) {
            console.error(`username input is not valid.`);
            return;
        }

        if (!this.username.value) {
            console.error(`username input value is null.`);
            return;
        }

        try {
            this.signal.update(state => ({ ...state, performingAction: true, user: this.username.value }));
            const result = await lastValueFrom(this.passwords.requestOTP(this.username.value));
            if (result) {
                this.signal.update((state) => ({ ...state, performingAction: false, requestedPasswordReset: true }));
            }

        } catch (error) {
            console.error(`error performing request, ${error}`);
            if (error instanceof PasswordResetError) {
                this.controller.endAction(error.message, 'bad-request');
            }

            this.signal.update((state) => ({ ...state, performingAction: false }));
        }
    }

    protected handleOTPChange(e: unknown) {
        if (e && typeof e === 'string' && String(e).length === 6) {
            this.signal.update((value) => ({ ...value, otp: { ...value.otp, value: String(e) } }));
        }
    }

    protected validateOTP(value: Optional<string>) {
        this.signal.update(state => ({ ...state, performingAction: true }));
        setTimeout(() => {
            this.signal.update((state) => ({ ...state, performingAction: false, otp: { ...state.otp, valid: true, verified: true, value } }));
        }, 1000);
    }

    protected async resetPassword(user: Optional<string>, authCode: string) {
        if (!user) {
            console.error(`error resetting password, user is null`);
            return;
        }

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

        if (!this.password.value) {
            return;
        }

        if (!this.passwordConfirmation.value) {
            return;
        }

        if (this.password.value !== this.passwordConfirmation.value) {
            this.password.setErrors({ ...(this.password.errors ?? {}), match: { input: 'password_confirmation' } });
            this.passwordConfirmation.setErrors({ ...(this.passwordConfirmation.errors ?? {}), match: { input: 'password' } });
            return;
        }

        try {
            this.signal.update(state => ({ ...state, performingAction: true }));
            const result = await lastValueFrom(this.passwords.resetPassword(user, this.password.value, authCode));
            if (result) {
                this.signal.update((state) => ({ ...state, performingAction: false, completed: true }));
            }

        } catch (error) {
            console.error(`error performing request, ${error}`);
            if (error instanceof PasswordResetError) {
                this.controller.endAction(error.message, 'bad-request');
            }
            this.signal.update((state) => ({ ...state, performingAction: false }));
        }
    }

}