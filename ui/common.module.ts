import { NgModule } from "@angular/core";
import { TokenCanAnyPipe, TokenCanPipe } from "./pipes";
import { AuthDirectivesModule } from "./directives";

@NgModule({
  imports: [AuthDirectivesModule],
  declarations: [TokenCanAnyPipe, TokenCanPipe],
  exports: [AuthDirectivesModule, TokenCanAnyPipe, TokenCanPipe],
})
export class CommonDirectivesModule {}
