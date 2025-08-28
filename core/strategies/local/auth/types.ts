import { Observable } from "rxjs";
import { SignInResult, SignInResultInterface } from "../../../../types";

export type AccessTokenType = {
  authToken?: string;
  authorizationCode?: string;
  expires_at: string;
  id: string | number;
  idToken: string;
  provider?: string;
};

/** @deprecated type declaration for token user query result */
export type UserInterface = {
  id: number | string;
  username: string;
  user_details: {
    firstname: string;
    lastname: string;
    address?: string;
    phone_number?: string;
    profile_url?: string;
    emails: string[];
  };
  double_auth_active: boolean;
  authorizations: string[];
  roles: string[];
};

/**
 * signed in user resolver type declaration
 */
export type UserResolver = {
  /** sends request to authentication server to resolve signed in user */
  user(token: string): Observable<SignInResultInterface>;

  /** revoke the signed in user token */
  revoke(revoke?: boolean): Observable<any>;
};

/**
 * sign in request handler type declaration
 */
export type SignInRequestHandler = {
  /** send a sign request to the backend server */
  sendRequest(params: Record<string, unknown>): Observable<SignInResult>;
};

/** @internal enpoints type declarations */
export type Endpoints = {
  me: string;
  signIn: string;
  signOut: string;
};
