import { Injector } from "@angular/core";
import { AuthServiceConfig } from "./auth";
import { Router } from "@angular/router";

/** @description Auth service configuration provider type declaration */
export type ProvideAuthServiceConfig = (
  injector: Injector
) => AuthServiceConfig;

/** @description Auth action handlers providers */
export type ProvideActionHandlers = (router: Router) => void;
