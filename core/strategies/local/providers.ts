import { HttpClient } from "@angular/common/http";
import { RESTInterfaceType, UserInterface } from "./types";
import { LocalStrategy } from "./strategy";
import { SignInResultInterface } from "../../../types";

type ProvideLocalStorageType = {
  client: HttpClient;
  host: string;
  storage: Storage;
  endpoints?: Partial<RESTInterfaceType>;
  driver?: string;
  authResultCallback?: (result: Partial<SignInResultInterface>) => boolean;
  userResultCallback?: (result: UserInterface) => void;
};

/**
 * Factory function to create a local strategy instance
 */
export function useLocalStrategy(param: ProvideLocalStorageType) {
  const {
    client,
    host,
    storage,
    endpoints,
    driver,
    authResultCallback,
    userResultCallback,
  } = param;
  return new LocalStrategy(
    client,
    host,
    storage,
    endpoints,
    driver ?? "default",
    authResultCallback,
    userResultCallback
  );
}
