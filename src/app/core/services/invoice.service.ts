import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private searchInvoiceSource = new BehaviorSubject<string>('');
searchInvoice$ = this.searchInvoiceSource.asObservable();

private refreshInvoiceSource = new BehaviorSubject<boolean>(false);
refreshInvoice$ = this.refreshInvoiceSource.asObservable();

  constructor() { }

  updateSearchInvoice(searchText: string) {
    this.searchInvoiceSource.next(searchText);
  }
  
  updateRefreshInvoice() {
    this.refreshInvoiceSource.next(true);
  }
}
