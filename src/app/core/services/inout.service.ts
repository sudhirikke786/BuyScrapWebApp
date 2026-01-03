import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InoutService {

  private searchInOutSource = new BehaviorSubject<string>('');
searchInOut$ = this.searchInOutSource.asObservable();

private refreshInOutSource = new BehaviorSubject<boolean>(false);
refreshInOut$ = this.refreshInOutSource.asObservable();

constructor() { }


updateSearchInOut(searchText: string) {
  this.searchInOutSource.next(searchText);
}

updateRefreshInOut() {
  this.refreshInOutSource.next(true);
}
}
