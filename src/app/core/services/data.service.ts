import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private _cashDrawerDetail: any;
  private _cashDrawerAmountAndPaidTicketCount: any;
  private _newShipOut: any;  
  // _cashDrawerAmountDTO: any;
 
  private _cashDrawerAmountDTO = new BehaviorSubject<any>(0);
  private _cashDrawerAmountDTO$ = this._cashDrawerAmountDTO.asObservable();
 
  private _paidCount = new BehaviorSubject<any>(0);
  private _paidCount$ = this._paidCount.asObservable();


  private _planDetails :any;

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
  
  setPaidCount(val: any) {
    this._paidCount.next(val);
  }

  getPaidCount() {
    return this._paidCount$;
  }

  setNewShipOut(val: any) {
    this._newShipOut = val;
  }

  getNewShipOut() {
    return this._newShipOut;
  }

  getActivePlan() {
    return this._planDetails
  }

  setSubscriptionPlan(planObj:any) {
     this._planDetails = planObj; 
  }



}
