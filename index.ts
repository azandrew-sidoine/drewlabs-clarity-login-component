export { LoginModule } from "./login.module";
export { AuthStrategies } from "./constants";
export { AUTH_SERVICE } from "./constants";

// Exported types
export {
  AuthServiceInterface,
  SignInResultInterface,
  DoubleAuthSignInResultInterface,
} from "./types";

/** Exported angular providers */
export { provideRedirectUrl } from "./providers";

/** Exported core components and types */
export {
  useLocalStrategy,
  tokenCan,
  tokenCanAny,
  provideAuthActionHandlersFactory,
} from "./core";
