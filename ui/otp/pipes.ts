import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: true,
  name: "newarray",
  pure: true,
})
export class NewArrayPipe implements PipeTransform {
  /** @description Creates an array of the provided size with indexes initialized with the fill parameter  */
  transform<T>(size: number, fill?: T) {
    return [...Array(size).fill(fill)] as T[];
  }
}
