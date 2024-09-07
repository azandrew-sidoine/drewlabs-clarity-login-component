import { ModuleWithProviders, NgModule } from "@angular/core";
import { ActionHandlersType, ProvideAuthServiceConfig } from "./types";
import { provideAuthConfig, provideAuthEventsHandler } from "./providers";

@NgModule()
export class LoginModule {
  static forRoot(p: {
    handleActions: ActionHandlersType;
    authConfigProvider: ProvideAuthServiceConfig;
  }): ModuleWithProviders<LoginModule> {
    const { handleActions, authConfigProvider } = p;
    return {
      ngModule: LoginModule,
      providers: [
        provideAuthEventsHandler(handleActions),
        provideAuthConfig(authConfigProvider),
      ],
    };
  }
}
