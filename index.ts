export { LoginModule } from "./login.module";
export { AuthStrategies } from "./constants";

// Exported types
export {
  AuthServiceInterface,
  SignInResultInterface,
  DoubleAuthSignInResultInterface,
  AuthUser,
  TokenResult,
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
  AUTH_SERVICE,
  createAuthProvider,
  createAuthUser,
  createTokenResult
} from "./core";

/** Exported interceptor factories */
export {
  authClientInterceporFactory,
  bearerTokenInterceptorFactory,
  http401LogoutFactory,
} from "./interceptors";
