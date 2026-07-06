import { inject, Injector, Provider } from "@angular/core";
import { PASSWORD_RESET, PasswordResetProvider } from "./types";

/** password reset factory provider */
export function providePasswordResetProvider(provider: (injector: Injector) => PasswordResetProvider) {
    return {
        provide: PASSWORD_RESET,
        useFactory: () => provider(inject(Injector))
    } as Provider;
}