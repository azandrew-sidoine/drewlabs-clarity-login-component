import { Injector } from "@angular/core";
import { SignInResultInterface } from "../types";

/** @internal */
export type UIMetadata = {
  /** Application logo url or path */
  logo?: string | null;
  /** Login ui description message */
  description?: string | null;
  /** Application company name */
  company?: string | null;
  /** application name */
  name?: string | null;
  /** dashboard ui resolver function. If value is a string, we simply call angular router.navigate()  */
  dashboard: string | ((i: Injector, state: SignInResultInterface) => void);


  /** application subname or description */
  subname?: string | null;
  /** application theme */
  theme?: string | null;
  /** boolean flag to enable remember me flag */
  remember?: boolean;
  appname?: string | null;

  /** application level logo */
  applogo?: string | null;
};
