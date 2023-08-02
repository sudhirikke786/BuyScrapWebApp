import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private _cashDrawerDetail: any;
  private _cashDrawerAmountAndPaidTicketCount: any;
  private _cashDrawerAmountDTO: any;

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
  
  set cashDrawerAmountDTO(val: any) {
    this._cashDrawerAmountDTO = val;
  }

  get cashDrawerAmountDTO() {
    return this._cashDrawerAmountDTO;
  }

}
