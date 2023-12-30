import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substr',
  pure: true,
})
export class SubstrPipe implements PipeTransform {
  //
  transform(value: string | null | undefined, length: number = 20) {
    value = value ?? '';
    return value.length > length ? `${value.substring(0, length)}...` : value;
  }
}
