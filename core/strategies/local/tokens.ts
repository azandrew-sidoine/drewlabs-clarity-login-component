import { InjectionToken } from "@angular/core";
import { AuthClientConfig } from "./types";

/** @deprecated Auth client provider token */
export const AUTH_CLIENT_CONFIG = new InjectionToken<AuthClientConfig>(
  "AUTH CLIENT CONFIG"
);