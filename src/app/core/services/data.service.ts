import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private _cashDrawerDetail: any;
  private _cashDrawerAmountAndPaidTicketCount: any;
  // _cashDrawerAmountDTO: any;
 
  private _cashDrawerAmountDTO = new BehaviorSubject<any>(0);
  private _cashDrawerAmountDTO$ = this._cashDrawerAmountDTO.asObservable();

  set cashDrawerDetail(val: any) {
    this._cashDrawerDetail = val;
  }

  get cashDrawerDetail() {
    return this._cashDrawerDetail;
  }

  set cashDrawerAmountAndPaidTicketCount(val: any) {
    this._cashDrawerAmountAndPaidTicketCount = val;
  }

  get cashDrawerAmountAndPaidTicketCount() {
    return this._cashDrawerAmountAndPaidTicketCount;
  }
  
  setCashDrawerAmountDTO(val: any) {
    this._cashDrawerAmountDTO.next(val);
  }

  getCashDrawerAmountDTO() {
    return this._cashDrawerAmountDTO$;
  }

}
