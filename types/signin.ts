export type TokenResult = {
  authToken: string;
  idToken?: string;
  scopes?: string[];
  expiresAt?: number;
};

export type AuthUser = {
  provider: string;
  id: string | number;
  email?: string;
  emails: string[];
  name: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  gender?: string;
  authorizationCode?: string;
  response: any;
  phoneNumber?: string;
  address?: string;
  birthdate?: string;
};

/** @description authentication driver sign in result instance type declaration */
export type SignInResultInterface = TokenResult & AuthUser;

/** @description Authentication driver 2fa sign in result instance type declaration  */
export interface DoubleAuthSignInResultInterface {
  is2faEnabled: boolean;
  auth2faToken: string;
}

/** @description Authentication driver sign in failure instance type declaration  */
export interface UnAuthenticatedResultInterface {
  locked?: boolean;
  authenticated: boolean;
}

/** @description Union type for various authentication sign in result type declaration */
export type SignInResult =
  | Partial<SignInResultInterface>
  | DoubleAuthSignInResultInterface
  | UnAuthenticatedResultInterface;

/** @description Local strategy sign in function parameter type declaration */
type LocalSignInOptionsType = {
  username: string;
  password: string;
  remember: string;
};

/** @description Scope based signin option type declaration */
type ScopeSignInOptionsType = {
  scopes: string[] | string;
};

/** @description Union type for various sign in options */
export type SignInOptionsType = LocalSignInOptionsType | ScopeSignInOptionsType;
