import { NgModule } from "@angular/core";
import { UserMetadaComponent } from "./user-metadata.component";
import { CommonModule } from "@angular/common";
import { SubstrPipe } from "./pipes";

@NgModule({
  imports: [CommonModule],
  exports: [UserMetadaComponent],
  declarations: [UserMetadaComponent, SubstrPipe],
})
export class UserMetadaModule {}
