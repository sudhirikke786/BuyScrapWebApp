import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellersService {

  private searchSellerSource = new BehaviorSubject<string>('');
  searchSeller$ = this.searchSellerSource.asObservable();

  private refreshSellerSource = new BehaviorSubject<boolean>(false);
  refreshSeller$ = this.refreshSellerSource.asObservable();

  constructor() { }

  updateSearchSeller(searchText: string) {
    this.searchSellerSource.next(searchText);
  }

  updateRefreshSeller() {
    this.refreshSellerSource.next(true);
  }
}
