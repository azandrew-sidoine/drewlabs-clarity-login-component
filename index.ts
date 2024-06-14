export { LoginModule } from "./login.module";
export { AuthStrategies } from "./constants";

// Exported types
export {
  AuthServiceInterface,
  SignInResultInterface,
  DoubleAuthSignInResultInterface,
} from "./types";

/** Exported angular providers */
export {
  provideRedirectUrl,
  provideAuthEventsHandler,
  provideAuthConfig,
} from "./providers";

/** Exported core components and types */
export {
  useLocalStrategy,
  tokenCan,
  tokenCanAny,
  provideAuthActionHandlersFactory,
  AUTH_SERVICE
} from "./core";

/** Exported interceptor factories */
export {
  authClientInterceporFactory,
  bearerTokenInterceptorFactory,
  http401LogoutFactory,
} from "./interceptors";
