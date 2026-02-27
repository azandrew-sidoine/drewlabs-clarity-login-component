import { ModuleWithProviders, NgModule } from '@angular/core';
import { ActionHandlersType, ProvideAuthServiceConfig } from './types';
import {
  provideAuthConfig,
  provideAuthEventsHandler,
  provideRedirectUrl,
} from './providers';

// @internal
type ConfigType = {
  actions?: Partial<ActionHandlersType>;
  redirect?: string;
  config: ProvideAuthServiceConfig;
};

// @internal
const voidStrategiesConfig = () => ({ strategies: [] });

@NgModule()
export class LoginModule {
  static forRoot(p: Partial<ConfigType>): ModuleWithProviders<LoginModule> {
    const { actions: handleActions, redirect, config } = p;
    return {
      ngModule: LoginModule,
      providers: [
        provideAuthEventsHandler(handleActions ?? {}),
        provideAuthConfig(config ?? voidStrategiesConfig),
        provideRedirectUrl(redirect ?? '/auth/login'),
      ],
    };
  }
}
