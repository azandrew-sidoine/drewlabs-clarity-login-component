//#region types
import { SignInResultInterface } from "../../../types";

/** exported sign in result type */
export type SingInResultType = SignInResultInterface | null;

/** auth clients configuration type declarations */
export type AuthClientConfig = {
  id: string;
  secret: string;
};

/** auth result callback type declaration */
export type AuthResultCallbackType = (
  result: Partial<SignInResultInterface>
) => boolean;
//#endregion Types
