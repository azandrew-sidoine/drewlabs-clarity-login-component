import { Injector } from "@angular/core";
import { SignInResultInterface } from "../types";

/**
 * @internal
 */
export type Callback = (...args: any) => unknown;

/**
 * @internal
 */
export type ActionHandlersObjectType = {
  success: Callback;
  failure: Callback;
  error: Callback;
  logout?: (
    injector: Injector,
    provider?: string,
    signInResult?: SignInResultInterface
  ) => void | false;
  performingAction?: Callback;
  loginPath?: string;
};

/**
 * Action handlers object type declaration
 */
export type ActionHandlersType =
  | ActionHandlersObjectType
  | ((injector: Injector) => ActionHandlersObjectType);
