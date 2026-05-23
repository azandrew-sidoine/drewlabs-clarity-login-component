import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'ngx-login-password-forgot',
    templateUrl: './password-forgot.component.html',
    styleUrls: ['./password-forgot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordForgot {

}