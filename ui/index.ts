import { AUTH_CALLBACK_PIPES, AuthCallbackComponent } from "./callback";
import {
  IfAuthenticatedDirective,
  IfHasAnyScopeDirective,
  IfHasScopesDirective,
  LogoutDirective,
  UsernameDirective,
} from "./directives";
import { LoginComponent } from "./login";
import { MetadataComponent } from "./metadata";
import { OTPComponent } from "./otp";
import { TokenCanAnyPipe, TokenCanPipe } from "./pipes";

export { LoginComponent } from "./login";
export {
  IfAuthenticatedDirective,
  IfHasAnyScopeDirective,
  IfHasScopesDirective,
} from "./directives";
export { TokenCanAnyPipe, TokenCanPipe } from "./pipes";
export { provideAuthMetadata } from "./providers";

/** Exported standalone pipes */
export const AUTH_PIPES = [
  TokenCanAnyPipe,
  TokenCanPipe,
  ...AUTH_CALLBACK_PIPES,
] as const;

/** Exported standalone directives */
export const AUTH_DIRECTIVES = [
  IfAuthenticatedDirective,
  IfHasAnyScopeDirective,
  IfHasScopesDirective,
  AuthCallbackComponent,
  LoginComponent,
  MetadataComponent,
  OTPComponent,
  UsernameDirective,
  LogoutDirective
] as const;
