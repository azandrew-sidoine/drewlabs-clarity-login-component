/** @internal */
export type Optional<T> = T | null | undefined;


export type SignalType = {
    performingAction: boolean, 
    requestedPasswordReset: boolean,
    completed: boolean;
    otp: {
        value?: string | null;
        valid: boolean;
        verified: boolean;
    }
}