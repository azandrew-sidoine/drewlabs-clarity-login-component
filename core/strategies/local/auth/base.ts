import { RequestClient, SignInResult } from "../../../../types";
import {
  AccessTokenType,
  RESTInterfaceType,
  SignInRequestHandler,
  UserInterface,
  UserResolver,
} from "./types";
import { Observable } from "rxjs";

export class AuthProvider implements UserResolver, SignInRequestHandler {
  // Class constructor
  constructor(
    private http: RequestClient,
    private endpoints: RESTInterfaceType
  ) {}

  sendRequest(params: Record<string, unknown>): Observable<SignInResult> {
    return this.http.post(
      this.endpoints.signIn,
      params
    ) as Observable<SignInResult>;
  }

  user(authToken: string) {
    return this.http.get(this.endpoints.users, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }) as Observable<UserInterface & { accessToken: AccessTokenType }>;
  }

  revoke(revoke?: boolean, authToken?: string): Observable<any> {
    return this.http.get(this.endpoints.users, {
      params: { revoke },
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
  }
}
