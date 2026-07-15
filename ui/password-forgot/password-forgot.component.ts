import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, Input, Optional as NgOptional, OnDestroy, ViewChild, signal as createSignal, effect } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UIMetadata } from "../type";
import { AUTH_METADATA } from "../providers";
import { PasswordResetError, Optional, PASSWORD_RESET, PasswordResetProvider, SignalType } from "./types";
import { COMMON_PIPES } from "@azlabsjs/ngx-common";
import { OTPComponent } from "../otp";
import { lastValueFrom, Subject, Subscription } from "rxjs";
import { DOCUMENT_LOCAL_STORAGE } from "@azlabsjs/ngx-storage";
import { UI_EVENTS_CONTROLLER, UIEventsControllerType } from "../../../directives/ui-events";
import { PasswordInputDirective } from "../login/password-input.directive";
import { PasswordToggleComponent } from "../login/password-toggle";

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, OTPComponent, ...COMMON_PIPES, PasswordToggleComponent, PasswordInputDirective],
    selector: 'ngx-login-password-forgot',
    templateUrl: './password-forgot.component.html',
    styleUrls: ['./password-forgot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordForgot implements OnDestroy {
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

    private _maxtries = 2;
    @Input() set maxtries(value: Optional<number>) {
        if (value) {
            this._maxtries = value;
        }
    }


    @ViewChild('passwordref', { static: false, read: PasswordInputDirective }) passwordinput!: PasswordInputDirective | null;
    @ViewChild('passwordconfirmationref', { static: false, read: PasswordInputDirective }) passwordconfirmationinput!: PasswordInputDirective | null;

    protected username = new FormControl<string>('', Validators.compose([Validators.required]));
    protected password = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(this._minlength)]));
    protected passwordConfirmation = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(this._minlength)]));
    protected signal = createSignal<SignalType>({ performingAction: false, requestedPasswordReset: false, completed: false, user: null, otp: { value: null, valid: true, verified: false }, lock: { expiresAt: null, tries: 0 } });
    protected timerSignal = createSignal<{ minutes: string, seconds: string }>({ minutes: '00', seconds: '00' });

    private counter = new Subject<Date>();
    private counterSubscription: Optional<Subscription>;
    private timerInterval: ReturnType<typeof setInterval> | undefined = undefined;

    constructor(
        @NgOptional() @Inject(DOCUMENT_LOCAL_STORAGE) private storage: Storage,
        @NgOptional() @Inject(PASSWORD_RESET) private passwords: PasswordResetProvider,
        @NgOptional() @Inject(UI_EVENTS_CONTROLLER) private controller: UIEventsControllerType,
        @NgOptional() @Inject(AUTH_METADATA) metadata: UIMetadata | null) {
        if (metadata) {
            this._logo = metadata.logo;
        }

        effect(() => {
            const { lock: { expiresAt, tries }, user } = this.signal();

            if (user && !expiresAt && tries === 0) {
                this.storage.removeItem(`${user}_lock`);
            }
        });


        this.counterSubscription = this.counter.subscribe(value => {
            clearInterval(this.timerInterval);
            this.timerSignal.update(() => ({ minutes: '00', seconds: '00' }));
            if (value) {
                this.timerInterval = setInterval(() => {
                    const seconds = Math.abs(value.getTime() - new Date().getTime()) / 1000;
                    const dm = Math.floor(seconds / 60);
                    const ds = parseInt(String(seconds % 60));

                    if (dm === 0 && ds === 0) {
                        clearInterval(this.timerInterval);
                        this.signal.update(state => ({ ...state, lock: { ...state.lock, expiresAt: null, tries: 0 } }));
                        this.timerSignal.update(() => ({ minutes: '00', seconds: '00' }));
                    }

                    this.timerSignal.update(state => ({ ...state, minutes: String(dm).padStart(2, '0'), seconds: String(ds).padStart(2, '0') }));
                }, 1000);
            }
        });
    }

    ngOnDestroy() {
        if (this.counterSubscription) {
            this.counterSubscription.unsubscribe();
        }
    }

    showOtpView() {
        this.password.reset();
        this.passwordConfirmation.reset();
        this.signal.update(state => ({ ...state, otp: { ...state.otp, verified: false, value: null } }));
    }

    showRequestOtpView() {
        this.username.reset();
        this.signal.update(state => ({ ...state, requestedPasswordReset: false, completed: false, user: null, otp: { ...state.otp, verified: false, value: null } }));
        this.timerSignal.update(() => ({ minutes: '00', seconds: '00' }));

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

        const keyName = `${this.username.value}_lock`;
        const cachedLock = this.storage.getItem(keyName);
        let { lock: { tries, expiresAt }, requestedPasswordReset, user } = this.signal();

        // case user input value changes, we reset the trie and expiresAt conint the context
        if (user !== this.username.value) {
            tries = 0;
            expiresAt = null;
        }

        if (cachedLock) {
            const cachedLockValue = JSON.parse(cachedLock);
            if (cachedLockValue && typeof cachedLockValue === 'object' && 'tries' in cachedLockValue && 'expiresAt' in cachedLockValue) {
                if (cachedLockValue.expiresAt) {
                    const dt = new Date(cachedLockValue.expiresAt).getTime() - new Date().getTime();
                    // case expiresAt is in the pass, we remove it from the local storage
                    if (dt < 0) {
                        this.storage.removeItem(keyName);
                    } else {
                        expiresAt = new Date(cachedLockValue.expiresAt);
                        tries = cachedLockValue.tries as number;
                    }
                }

                // when we load expiresAt from storage and it value is not null, we notify the counter
                if (expiresAt) {
                    if (this.timerInterval) {
                        clearInterval(this.timerInterval);
                    }
                    this.counter.next(expiresAt);
                }
            }
        }
        tries += 1;


        try {

            // case lock is enabled we simulate a navigation to otp view case user is not on the otp view
            if ((tries > this._maxtries) || (expiresAt && expiresAt.getTime() - new Date().getTime() > 0)) {

                if (!requestedPasswordReset) {
                    this.signal.update(state => ({ ...state, performingAction: true, user: state.user ?? this.username.value, lock: { ...state.lock, tries, expiresAt } }));
                    setTimeout(() => {
                        this.signal.update((state) => ({ ...state, performingAction: false, requestedPasswordReset: true }));
                    }, 1000);
                }

                return;
            }


            this.signal.update(state => {
                // we set the expiresAt value whenever tries is greater than or equals to max tries
                if (tries >= this._maxtries && (typeof expiresAt === 'undefined' || expiresAt === null)) {
                    const currentdate = new Date();
                    currentdate.setHours(currentdate.getHours() + 1);
                    expiresAt = currentdate;

                    if (this.timerInterval) {
                        clearInterval(this.timerInterval);
                    }

                    this.counter.next(expiresAt);
                }

                // compute lock value based on expiresAt and tries
                const lock = { ...state.lock, expiresAt, tries: Math.min(tries, this._maxtries) };

                // save the lock state into local storage in order to load it on the next otp request
                this.storage.setItem(keyName, JSON.stringify({ tries: lock.tries, expiresAt: lock.expiresAt ? lock.expiresAt.getTime() : null }));

                return { ...state, performingAction: true, user: this.username.value, lock };
            });

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