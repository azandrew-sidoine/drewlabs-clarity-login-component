import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthCallbackComponent } from "./callback";
import { PasswordForgot } from "./password-forgot";

/** routes definition for login module */
export function createRoutes(redirect: string) {
  return [
    {
      path: "login",
      component: LoginComponent,
    },
    {
      path: "reset-password",
      component: PasswordForgot,
    },
    {
      path: "callback",
      component: AuthCallbackComponent,
      data: { redirect },
    },
  ] as Routes;
}
