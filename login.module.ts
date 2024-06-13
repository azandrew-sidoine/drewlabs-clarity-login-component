import { Injector, ModuleWithProviders, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import {
  AUTH_ACTION_HANDLERS,
  AUTH_SERVICE,
  AUTH_SERVICE_CONFIG,
} from "./constants";
import {
  ActionHandlersType,
  AuthService,
  provideAuthActionHandlersFactory,
  AuthClientConfig,
  AUTH_CLIENT_CONFIG,
  AuthClientInterceptor,
} from "./core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./http";
import { ProvideAuthServiceConfig } from "./types";

@NgModule()
export class LoginModule {
  static forRoot(p: {
    handleActions: ActionHandlersType;
    authConfigProvider: ProvideAuthServiceConfig;
    authClientConfigProvider?: (injector: Injector) => AuthClientConfig;
  }): ModuleWithProviders<LoginModule> {
    const { handleActions, authConfigProvider, authClientConfigProvider } = p;
    return {
      ngModule: LoginModule,
      providers: [
        {
          provide: AUTH_ACTION_HANDLERS,
          useFactory: (injector: Injector, router: Router) => {
            return provideAuthActionHandlersFactory(handleActions)(
              injector,
              router
            );
          },
          deps: [Injector, Router],
        },
        {
          provide: AUTH_SERVICE_CONFIG,
          useFactory: authConfigProvider,
          deps: [Injector],
        },
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
        {
          provide: AUTH_CLIENT_CONFIG,
          useFactory:
            authClientConfigProvider ??
            (() => {
              return {
                id: "",
                secret: "",
              } as AuthClientConfig;
            }),
          deps: [Injector],
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthClientInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    };
  }
}
