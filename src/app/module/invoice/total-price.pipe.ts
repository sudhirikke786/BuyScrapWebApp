import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalPrice'
})
export class TotalPricePipe implements PipeTransform {
  transform(items: any[], field: string): number {
    if (!items || !field) {
      return 0;
    }
    return items.reduce((total, item) => total + (item[field] || 0), 0);
  }

}
