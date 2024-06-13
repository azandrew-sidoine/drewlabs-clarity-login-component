import { Injector } from "@angular/core";
import { SignInResultInterface } from "../types";

/** @internal */
export type UIMetadata = {
  /** @description Application logo url or path */
  logo?: string | null;
  /** @description Login ui description message */
  description?: string | null;
  /** @description Application company name */
  company?: string | null;
  /** @description Application name */
  name?: string | null;

  /** @description Boolean flag to enable remember me flag */
  remember?: boolean;

  /** @description dashboard ui resolver function. If value is a string, we simply call angular router.navigate()  */
  dashboard: string | ((i: Injector, state: SignInResultInterface) => void);
};
