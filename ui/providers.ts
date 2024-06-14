import { InjectionToken, Provider } from "@angular/core";
import { UIMetadata } from "./type";


/** @description Sigin & Sign Up UI metatada injection token */
export const AUTH_METADATA = new InjectionToken<UIMetadata>(
  "Sigin & Sign Up UI metatada"
);

/** @description Provides UI metadata for sign in & Sign Up web interfaces */
export function provideAuthMetadata(metadata: UIMetadata) {
  return {
    provide: AUTH_METADATA,
    useValue: metadata,
  } as Provider;
}
