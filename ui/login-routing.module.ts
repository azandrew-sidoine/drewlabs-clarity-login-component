import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login.component";
import { LoginViewComponent } from "./login-view.component";
import { AuthCallbackComponent } from "./auth-callback";

const LOGIN_ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "callback",
    component: AuthCallbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(LOGIN_ROUTES)],
  declarations: [],
  providers: [],
})
export class LoginRoutingModule {}

export const LOGIN_NAVIGATION_COMPONENTS = [LoginComponent, LoginViewComponent];
