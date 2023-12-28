//#region Types

import { SignInResultInterface } from "../../../types";

export type SingInResultType = SignInResultInterface | null;

/**
 * Auth clients configuration type declarations
 */
export type AuthClientConfig = {
  id: string;
  secret: string;
};

/**
 * Auth result callback type declaration
 */
export type AuthResultCallbackType = (
  result: Partial<SignInResultInterface>
) => boolean;
//#endregion Types
