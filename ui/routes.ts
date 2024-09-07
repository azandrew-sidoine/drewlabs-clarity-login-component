import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthCallbackComponent } from "./callback";

/** Exported routes definition for login module */
export default [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "callback",
    component: AuthCallbackComponent,
  },
] as Routes;
