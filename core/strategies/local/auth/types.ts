import { Observable } from "rxjs";
import { SignInResult } from "../../../../types";

export type AccessTokenType = {
  authToken?: string;
  authorizationCode?: string;
  expires_at: string;
  id: string|number;
  idToken: string;
  provider?: string;
};

/**
 * Type declaration for token user query result
 *
 * @internal
 */
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
 * Signed in user resolver type declaration
 */
export type UserResolver = {
  /**
   * Sends request to authentication server to resolve signed in user
   */
  user(
    token: string
  ): Observable<UserInterface & { accessToken: AccessTokenType }>;

  /**
   * Revoke the signed in user token
   */
  revoke(revoke?: boolean): Observable<any>;
};

/**
 * Sign in request handler type declaration
 */
export type SignInRequestHandler = {
  /**
   * Send a sign request to the backend server
   */
  sendRequest(params: Record<string, unknown>): Observable<SignInResult>;
};

/**
 * REST interface type enpoints type declarations
 *
 * @internal
 */
export type RESTInterfaceType = {
  users: string;
  signIn: string;
  signOut: string;
};
