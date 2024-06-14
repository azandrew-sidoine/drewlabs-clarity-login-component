import { InjectionToken, inject } from "@angular/core";
import {
  AuthActionHandlers,
  AuthServiceConfig,
  AuthServiceInterface,
} from "../types";
import { AuthService } from "./auth.service";

/** @description auth service config instance injection token*/
export const AUTH_SERVICE_CONFIG = new InjectionToken<AuthServiceConfig>(
  "AuthServiceConfig instance injection token"
);

/** @description auth service instance injection token */
export const AUTH_SERVICE = new InjectionToken<AuthServiceInterface>(
  "AuthServiceInterface instance injection token",
  {
    providedIn: "root",
    factory: () => inject(AuthService),
  }
); //

export const AUTH_ACTION_HANDLERS = new InjectionToken<AuthActionHandlers>(
  "AuthResultHandlers instance injection token"
);
