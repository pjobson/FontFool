import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dec2chr'
})
export class Dec2chrPipe implements PipeTransform {

  /**
   * transforms decimal to character
   * @function
   * @param {number} decimal code
   * @param {unknown[]} arguments - none supported
   */
  transform(dec: number, ...args: unknown[]): string {
    if (dec ===  32) {
      return '\u00a0';
    } else {
      return String.fromCharCode(dec);
    }
  }

}
