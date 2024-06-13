import { InjectionToken, Provider } from "@angular/core";
import { UIMetadata } from "./type";


/** @description Sigin & Sign Up UI metatada injection token */
export const UI_METADATA = new InjectionToken<UIMetadata>(
  "Sigin & Sign Up UI metatada"
);

/** @description Provides UI metadata for sign in & Sign Up web interfaces */
export function provideUIMetadata(metadata: UIMetadata) {
  return {
    provide: UI_METADATA,
    useValue: metadata,
  } as Provider;
}
