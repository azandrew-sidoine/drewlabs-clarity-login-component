import {
  RequestClient,
  SignInResult,
  SignInResultInterface,
  TokenResult,
} from "../../../../types";
import { Endpoints, SignInRequestHandler, UserResolver } from "./types";
import { map, Observable } from "rxjs";

// @internal
export type SignInRequestInterceptor = (
  params: Record<string, unknown>,
  url: string
) => Record<string, unknown>;

export class AuthProvider implements UserResolver, SignInRequestHandler {
  private beforeRequest: SignInRequestInterceptor;

  constructor(
    private http: RequestClient,
    private endpoints: Endpoints,
    private tokenResponseCallback: (response: any) => TokenResult,
    private userResponseCallback: (response: unknown) => SignInResultInterface,
    beforeRequest?: SignInRequestInterceptor
  ) {
    this.beforeRequest = beforeRequest ?? ((params) => params);
  }

  sendRequest(params: Record<string, unknown>): Observable<SignInResult> {
    const url = this.endpoints.signIn;
    return this.http
      .post(url, this.beforeRequest(params, url))
      .pipe(map((response) => this.tokenResponseCallback(response)));
  }

  user(authToken: string) {
    return this.http
      .get(this.endpoints.me, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .pipe(map((response) => this.userResponseCallback(response)));
  }

  revoke(revoke?: boolean, authToken?: string) {
    return this.http.get(this.endpoints.me, {
      params: { revoke },
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
  }
}
