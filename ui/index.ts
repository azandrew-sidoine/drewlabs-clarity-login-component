import { AUTH_CALLBACK_PIPES, AuthCallbackComponent } from "./callback";
import { IfAuthenticatedDirective, IfHasAnyScopeDirective, IfHasScopesDirective, LogoutDirective, UsernameDirective } from "./directives";
import { LoginComponent } from "./login";
import { MetadataComponent } from "./metadata";
import { OTPComponent } from "./otp";
import { TokenCanAnyPipe, TokenCanPipe } from "./pipes";

export { TokenCanAnyPipe, TokenCanPipe } from "./pipes";
export { provideAuthMetadata } from "./providers";

export * from "./login";
export * from "./password-forgot";
export * from "./directives";

export const AUTH_PIPES = [ TokenCanAnyPipe, TokenCanPipe, ...AUTH_CALLBACK_PIPES ] as const;
export const AUTH_DIRECTIVES = [ IfAuthenticatedDirective, IfHasAnyScopeDirective, IfHasScopesDirective, AuthCallbackComponent, LoginComponent, MetadataComponent, UsernameDirective, LogoutDirective, OTPComponent ] as const;
