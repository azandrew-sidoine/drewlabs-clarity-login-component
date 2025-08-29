import { ModuleWithProviders, NgModule } from "@angular/core";
import { ActionHandlersType, ProvideAuthServiceConfig } from "./types";
import { provideAuthConfig, provideAuthEventsHandler, provideRedirectUrl } from "./providers";

@NgModule()
export class LoginModule {
  static forRoot(p: {
    actions: ActionHandlersType;
    redirect?: string;
    config: ProvideAuthServiceConfig;
  }): ModuleWithProviders<LoginModule> {
    const { actions: handleActions, redirect, config } = p;
    return {
      ngModule: LoginModule,
      providers: [
        provideAuthEventsHandler(handleActions),
        provideAuthConfig(config),
        provideRedirectUrl(redirect ?? "/auth/login"),
      ],
    };
  }
}
