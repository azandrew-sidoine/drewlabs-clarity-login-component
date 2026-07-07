import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

/** @internal */
export type Optional<T> = T | null | undefined;

/** error class returned by password reset provider  */
export class PasswordResetError {

    constructor(public readonly message: string, public readonly code: number) { }

}

/** @internal */
export type SignalType = {
    performingAction: boolean, 
    requestedPasswordReset: boolean,
    completed: boolean,
    lock: {
        expiresAt?: Date | null,
        tries: number
    },
    user: Optional<string>,
    otp: {
        value?: string | null;
        valid: boolean;
        verified: boolean;
    }
}


/** Password reset service type declaration */
export type PasswordResetProvider = {

    /**
     * request password reset for the given user
     * 
     * @param user
     * 
     * @throws Error
     */
    requestOTP(user: string): Observable<boolean>;

    /**
     * reset user password using provided `password` parameter value
     * 
     * @param user 
     * @param password 
     * @param authCode
     * 
     * @throws Error
     * 
     */
    resetPassword(user: string, password: string, authCode: string): Observable<boolean>;
}

/** @description password reset service injection token */
export const PASSWORD_RESET = new InjectionToken<PasswordResetProvider>('password reset provider injection token');