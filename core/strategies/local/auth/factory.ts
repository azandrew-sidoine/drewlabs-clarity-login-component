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

/** authentication token result factory function */
export function createTokenResult(
  authToken: string,
  idToken: string,
  scopes: string[],
  expiresAt?: number
) {
  return { authToken, expiresAt, idToken, scopes } as TokenResult;
}

export function createAuthUser(
  id: string,
  name: string,
  email?: string,
  family_name?: string,
  given_name?: string,
  birthdate?: string,
  gender?: string,
  phone_number?: string,
  address?: string,
  picture?: string,
) {
  return {
    id,
    email,
    emails: email ? [email] : [],
    name,
    photoUrl: picture,
    firstName: given_name,
    lastName: family_name,
    birthdate,
    gender,
    phoneNumber: phone_number,
    address,
  } as SignInResultInterface;
}
