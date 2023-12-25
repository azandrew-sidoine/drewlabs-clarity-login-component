import { Provider } from "@angular/core";
import { InjectionToken } from "@angular/core";

/**
 * REDIRECT URL injection token
 */
export const REDIRECT_URL = new InjectionToken<string>(
  "REDIRECT URL injection token"
);

/**
 * Provides a url to redirect guest user
 */
export function provideRedirectUrl(url: string) {
  return {
    provide: REDIRECT_URL,
    useValue: url,
  } as Provider;
}
