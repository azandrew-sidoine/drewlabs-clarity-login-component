import { HttpClient } from "@angular/common/http";
import { LocalStrategy } from "./strategy";
import { SignInResultInterface } from "../../../types";
import { RESTInterfaceType, UserInterface, createAuthProvider } from "./auth";

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

  // Creates the auth provider instance
  const authProvider = createAuthProvider(client, endpoints, host);

  // Resolve the local strategy instance
  return new LocalStrategy(
    authProvider,
    authProvider,
    storage,
    driver ?? "default",
    authResultCallback,
    userResultCallback
  );
}


export function useAuthTokenStrategy() {
  
}