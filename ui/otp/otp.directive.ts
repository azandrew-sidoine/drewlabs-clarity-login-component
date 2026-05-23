import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[otp]',
})
export class OTPDirective {
  @Input({ alias: 'otp', required: true }) index!: number;

  /** @description get index of the last input element */
  @Input({ required: true }) last!: number;

  @Output() valueChange = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const target = e.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    if (isNaN(Number(target.value))) {
      target.value = '';
      return;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement | null;
    if (!target) {
      return;
    }

    const key = e.key.toLowerCase();
    if (key === 'backspace' || key === 'delete') {
      target.value = '';
      setTimeout(() => {
        (target.previousElementSibling as HTMLElement)?.focus();
        this.valueChange.emit('');
      }, 100);
      return;
    }

    const value = e.key;
    if (isNaN(Number(value))) {
      return;
    }

    if (this.index !== this.last) {
      setTimeout(() => (target.nextElementSibling as HTMLElement)?.focus(), 100);
    }

    target.value = value;
    setTimeout(() => this.valueChange.emit(value), 100);
  }

  constructor(private e: ElementRef) { }

  focus() {
    (this.e.nativeElement as HTMLInputElement).focus();
  }

  setValue(value: string) {
    (this.e.nativeElement as HTMLInputElement).value = value;
  }
}
