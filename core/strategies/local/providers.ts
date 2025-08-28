import { LocalStrategy } from "./strategy";
import { SignInResultInterface } from "../../../types";
import { SignInRequestHandler, UserResolver } from "./auth";

/** @internal */
type ProvideLocalStorageType = {
  provider: UserResolver & SignInRequestHandler;
  storage?: Storage;
  driver?: string;
  authResultCallback?: (result: Partial<SignInResultInterface>) => boolean;
  userResultCallback?: (result: SignInResultInterface) => void;
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
