import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from "@angular/common/http";
import { ProviderToken, inject } from "@angular/core";
import { AuthServiceInterface } from "./types";
import { catchError, lastValueFrom, throwError } from "rxjs";

/** @description provides an angular HTTP interceptor that add `x-client-id` and `x-client-secret` headers to the ongoing login request */
export function authClientInterceporFactory(
  id: string,
  secret?: string | null
) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (req.url.indexOf('login') === -1) {
      return next(req);
    } 

    req = req.clone({
      headers: req.headers
        .set("x-client-id", id ?? "")
        .set("x-client-secret", secret ?? ""),
    });

    return next(req);
  };
}

/** @description Provides an angular HTTP interceptor that add a bearer Token authorization header to the request */
export function bearerTokenInterceptorFactory(
  provider: ProviderToken<AuthServiceInterface>
) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const auth = inject(provider);
    if (!auth) {
      return next(req);
    }
    const authToken = auth.authToken;
    // Vérifier si la valeur du token est pas défini
    // Si la valeur du token d'authentification est défini
    // Modifier la requête en passant l'entête d'authorization
    // récupéré depuis le service de gestion des token
    if (authToken) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${authToken}`),
      });
    }
    // Retrourner la prochaine exécution de la pile des middlewares
    return next(req);
  };
}

/** @description Provide an angular HTTP interceptor that log user out on 401 error */
export function http401LogoutFactory(
  provider: ProviderToken<AuthServiceInterface>,
  callback: (e: HttpErrorResponse) => void
) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(
      catchError((err) => {
        const handler = async () => {
          return await lastValueFrom(inject(provider)?.signOut());
        };
        if (err instanceof HttpErrorResponse && err.status === 401) {
          handler();
          // call the callback when user logged out
          callback(err);
        }
        return throwError(() => err);
      })
    );
  };
}
