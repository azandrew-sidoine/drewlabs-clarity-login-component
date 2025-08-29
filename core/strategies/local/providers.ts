import { LocalStrategy } from "./strategy";
import { AuthUser, TokenResult } from "../../../types";
import { SignInRequestHandler, UserResolver } from "./auth";

/** @internal */
type ProvideLocalStorageType = {
  provider: UserResolver & SignInRequestHandler;
  storage?: Storage;
  driver?: string;
  authResultCallback?: (result: TokenResult) => boolean;
  userResultCallback?: (result: AuthUser) => void;
};

/** @description factory function to create a local strategy instance */
export function useLocalStrategy(param: ProvideLocalStorageType) {
  const { provider, storage, driver, authResultCallback, userResultCallback } =
    param;

  // resolve the local strategy instance
  return new LocalStrategy(
    provider,
    provider,
    storage,
    driver ?? "default",
    authResultCallback,
    userResultCallback
  );
}
