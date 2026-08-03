import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OTPDirective } from './otp.directive';
import { NewArrayPipe } from './pipes';
import { Subscription } from 'rxjs';
import { deequal, rpad } from './utils';

@Component({
  standalone: true,
  selector: 'ngx-auth-otp-input',
  imports: [CommonModule, FormsModule, OTPDirective, NewArrayPipe],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OTPComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OTPComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private _size: number = 4;
  get size() {
    return this._size;
  }
  protected state: string[] = [...Array(this._size).fill('')];
  protected _onChange: (...p: unknown[]) => void = () => { };
  protected _onTouched: (...p: unknown[]) => void = () => { };
  private subscription!: Subscription;

  @Input() set size(value: number) {
    // we force the OTP input to be between 4 and 6 inputs
    this._size = Math.max(4, Math.min(8, value));
    this.state = [...Array(this._size).fill('')];
    if (value < 4 || value > 8) {
      console.error(`OTP input size must be between 4 and 6, falling back to ${this._size}`);
    }
  }
  @Input() error: boolean = false;
  @Input() updates: 'blur' | 'change' = 'change';
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() submit = new EventEmitter<void>();
  @Output() disabledChange = new EventEmitter<boolean>();


  @HostListener('keyup.enter', [])
  onEnterEvent() {
    if (this.state.join('').length === this._size) {
      this.submit.emit();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    const value = e.clipboardData?.getData('text/plain');
    if (value && value.length === this.size) {
      // first we reset the state of the component
      this.reset();

      // then we write the pasted value into inputs
      this.writeValue(value);
      this.state = value.split('');
      this.valueChange.emit(value);
    }

    e.stopPropagation();
  }

  @HostListener('click', ['$event'])
  onPress(e: Event) {
    const items = this._query.toArray();
    const index = this.state.findIndex(value => value.trim() === '');
    const lastInput = index !== -1 ? items[index] : items[items.length - 1];
    const firstInput = items[0];

    if (lastInput && this.state.length === this.size && this.state.join('').trim() !== '') {
      lastInput.focus();
    }

    if (firstInput && this.state.join('').trim() === '') {
      firstInput.focus();
    }

  }

  @ViewChildren('input', { read: OTPDirective })
  query!: QueryList<OTPDirective>;
  private _query!: QueryList<OTPDirective>;

  /** @description handle changes at each otp input */
  onValueChange(index: number, value: string) {
    this.state[index] = value;

    const { updates } = this;

    if (updates === 'change') {
      return this.valueChange.emit(this.state.join(''));
    }
    const result = this.state.filter((v) => typeof v !== 'undefined' && v !== null && v.trim() !== '');

    if (updates === 'blur' && deequal(result, this.state)) {
      return this.valueChange.emit(this.state.join(''));
    }
  }

  writeValue(p: any): void {
    const values = rpad(String(p).split(''), '', this._size);
    const items = this._query.toArray();
    for (let i = 0; i < this._query.length; i++) {
      items[i].setValue(values[i]);
    }
  }

  reset() {
    this.writeValue('');
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.disabledChange.emit(this.disabled);
  }

  ngAfterViewInit(): void {
    this._query = this.query;
    this.subscription = this.query.changes.subscribe(
      (queryList: QueryList<OTPDirective>) => {
        this._query = queryList;
      }
    );

    if (this._query && this._query.first) {
      this._query.first.focus();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
