import {
  RequestClient,
  SignInResultInterface,
  TokenResult,
} from "../../../../types";
import { Endpoints } from "./types";
import { AuthProvider, SignInRequestInterceptor } from "./base";

/** auth provider factory function */
export function createAuthProvider(
  client: RequestClient,
  endpoints: Endpoints,
  tokenResponseCallback: (response: any) => TokenResult,
  userResponseCallback: (response: unknown) => SignInResultInterface,
  beforeRequest?: SignInRequestInterceptor
) {
  return new AuthProvider(
    client,
    endpoints,
    tokenResponseCallback,
    userResponseCallback,
    beforeRequest
  );
}
