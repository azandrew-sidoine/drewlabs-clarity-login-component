import { AUTH_CALLBACK_PIPES, AuthCallbackComponent } from "./callback";
import {
  IfAuthenticatedDirective,
  IfHasAnyScopeDirective,
  IfHasScopesDirective,
} from "./directives";
import { LoginComponent } from "./login";
import { MetadataComponent } from "./metadata";
import { TokenCanAnyPipe, TokenCanPipe } from "./pipes";

export { LoginComponent } from "./login";
export {
  IfAuthenticatedDirective,
  IfHasAnyScopeDirective,
  IfHasScopesDirective,
} from "./directives";
export { TokenCanAnyPipe, TokenCanPipe } from "./pipes";

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
] as const;
