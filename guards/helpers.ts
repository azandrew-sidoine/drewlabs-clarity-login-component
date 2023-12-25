import { Router } from "@angular/router";
// import { Location } from "@angular/common";

/**
 * Factory function for redirect url
 */
export function useAuthenticationResult(value: boolean, redirectTo: string) {
  const isValidURL = (url: string) => {
    try {
      const _url = new URL(url);
      return typeof _url.protocol !== "undefined" && _url.protocol !== null;
    } catch {
      return false;
    }
  };
  return (router: Router, window: Window) => {
    const redirectToURL = () => {
      window.location.href = redirectTo;
      return false;
    };
    if (value === true) {
      return value;
    }

    // case redirect to is a valid HTTP url we use the redirectToURL function
    return isValidURL(redirectTo)
      ? redirectToURL()
      : router.createUrlTree([redirectTo ?? "/login"]);
  };
}
