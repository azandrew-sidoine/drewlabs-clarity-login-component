import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { Inject, Injectable, OnDestroy, Optional } from "@angular/core";
import { AUTH_CLIENT_CONFIG } from "./tokens";
import { AuthClientConfig } from "./types";

@Injectable({
  providedIn: "root",
})
export class AuthClientInterceptor implements HttpInterceptor {
  constructor(
    @Optional()
    @Inject(AUTH_CLIENT_CONFIG)
    private config?: AuthClientConfig
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.config) {
      req = req.clone({
        headers: req.headers
          .set("x-authorization-client-id", this.config.id)
          .set("x-authorization-client-secret", this.config.secret),
      });
    }
    // Retrourner la prochaine exécution de la pile des middlewares
    return next.handle(req);
  }
}
