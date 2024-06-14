import { Injector, Provider, inject } from "@angular/core";
import { InjectionToken } from "@angular/core";
import { ActionHandlersType, ProvideAuthServiceConfig } from "./types";
import {
  AUTH_ACTION_HANDLERS,
  AUTH_SERVICE_CONFIG,
  provideAuthActionHandlersFactory,
} from "./core";
import { Router } from "@angular/router";

/** @description REDIRECT URL injection token */
export const REDIRECT_URL = new InjectionToken<string>(
  "REDIRECT URL injection token"
);

/** @description Provides a url to redirect guest user */
export function provideRedirectUrl(url: string) {
  return {
    provide: REDIRECT_URL,
    useValue: url,
  } as Provider;
}

/** @description  Ng provider for authentication service configuration*/
export function provideAuthConfig(p: ProvideAuthServiceConfig) {
  return {
    provide: AUTH_SERVICE_CONFIG,
    useFactory: () => p(inject(Injector)),
  } as Provider;
}

/** @description Provides an authentication events handler instance */
export function provideAuthEventsHandler(h: ActionHandlersType) {
  return {
    provide: AUTH_ACTION_HANDLERS,
    useFactory: () => {
      return provideAuthActionHandlersFactory(h)(
        inject(Injector),
        inject(Router)
      );
    },
  } as Provider;
}
