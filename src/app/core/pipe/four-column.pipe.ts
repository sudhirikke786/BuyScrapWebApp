import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fourColumn'
})
export class FourColumnPipe implements PipeTransform {

  transform(array: any[]) {
    return array.reduce((result: any, item: any, index: number) => (
      index % 4 ? result : [...result, [item, array[index + 1], array[index + 2], array[index + 3]]]
    ), []);
  }

}
