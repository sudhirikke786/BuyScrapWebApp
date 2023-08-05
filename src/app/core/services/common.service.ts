import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable, of, EMPTY, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  
  configJson: any;

  constructor(private http: HttpClient,private localService:StorageService) { }

  /* GET: get the data for type ahead select dropdown based on key passed*/
    callAPI(path: string, method: string, requestObj?: any, clientName?: string): Observable<any> {
    let httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
    });

    const userToken = this.localService.getLocalStorage('userObj');

    if (clientName) {
      httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'ClientName': clientName,
        "Authorization": "Bearer " + userToken?.token
      });
    }

    const httpOptions = {
        headers: httpHeader
    };

    const productionURL = path;

    if (method === 'GET') {
        return this.http.get(productionURL, {
            headers: httpHeader,
            observe: 'response',
            params: requestObj
        });
    } else if (method === 'POST') {
        return this.http.post<any>(productionURL, requestObj, {
            headers: httpHeader,
            observe: 'response'
        });
    } else if (method === 'PUT') {
        return this.http.put<any>(productionURL, requestObj, {
            headers: httpHeader,
            observe: 'response'
        });
    }

    return new Observable<any>(x => x.next(null));
  }

  private handleError(error: HttpErrorResponse) {
    return null; //throwError(error);
  }

  validateOrgCredentials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/ValidateCredentials', 'POST' , requestObj);
  }

  validateUserCredentials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/UserAuthentication', 'POST', requestObj, 'ProdTest');
  }

  getOrgLocation(): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Locations/GetAllLocatoins', 'GET', null, 'ProdTest');
  }

  getCashdrawerdetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashdrawerdetails', 'GET', paramObj, 'ProdTest');
  }

  getCashDrawerAmountDTO(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashDrawerAmountDTO', 'GET', paramObj, 'ProdTest');
  }

  getCashDrawerAmountAndPaidTicketCount(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashDrawerAmountAndPaidTicketCount', 'GET', paramObj, 'ProdTest');
  }

  insertUpdateCashDrawerTransactions(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/InsertUpdateCashDrawerTransactions', 'POST', requestObj, 'ProdTest');
  }

  insertCashDrawerDetails(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/InsertCashDrawerDetails', 'POST', requestObj, 'ProdTest');
  }

  getAllTicketsDetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsDetails', 'GET', paramObj, 'ProdTest');
  }

  getAllTicketsByParentID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsByParentID', 'GET', paramObj, 'ProdTest');
  }

  insertUpdateTickets(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/InsertUpdateTickets', 'POST', requestObj, 'ProdTest');
  }

  getAllTicketsBySellerId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsBySellerId', 'GET', paramObj, 'ProdTest');
  }

  getAllsellersDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetAllsellersDetails', 'GET', pagination, 'ProdTest');
  }

  getSellerById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetSellerById', 'GET', paramObj, 'ProdTest');
  }

  addSeller(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/InsertSellerDTO', 'POST', requestObj, 'ProdTest');
  }
  
  getTransactionsDetailsById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/TransactionMasters/GetTicketMaterialsDetailsByTicketId', 'GET', paramObj, 'ProdTest');
  }

  getAllGroupMaterial(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllGroupMaterial', 'GET', paramObj, 'ProdTest');
  }

  getAllSubMaterials(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllSubMaterials', 'GET', paramObj, 'ProdTest');
  }  

  GetAllAdjustmentType(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Adjustments/GetAllAdjustmentType', 'GET', paramObj, 'ProdTest');
  }

  getAllShipOutDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetAllShipOutDetails', 'GET', pagination, 'ProdTest');
  }

  getShipOutDetailsByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetShipOutDetailsByID', 'GET', paramObj, 'ProdTest');
  }

  getAllCODTickets(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllCODTickets', 'GET', pagination, 'ProdTest');
  }

  /** settings page */

  getAllSettingsTicketDetails(paramObj: any){
    return this.callAPI(environment.baseUrl + '/Settingss/GetAllTicketDetails', 'GET', paramObj, 'ProdTest');
  }

  InsertUpdateTicketSettings(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/InsertUpdateTicketSettings', 'POST', requestObj, 'ProdTest');
  }

  GetSystemPreferencesValue(paramObj: any){
    return this.callAPI(environment.baseUrl + '/SystemPreferences/GetSystemPreferencesValue', 'GET', paramObj, 'ProdTest');
  }
  
  InsertUpdateSystemPreferences(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/SystemPreferences/InsertUpdateSystemPreferences', 'POST', requestObj, 'ProdTest');
  }
  
  /** Reports */

  getDailyTicketsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllTicketsForDailyReport', 'GET', paramObj, 'ProdTest');
  }

  getSingleTicketReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllTicketsDetails', 'GET', paramObj, 'ProdTest');
  }

  getInventoryReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllInventoryReport', 'GET', paramObj, 'ProdTest');
  }

  getCashDrawerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetCashDrawerReportDataShow', 'GET', paramObj, 'ProdTest');
  }

  getCustomerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllSellersofReport', 'GET', paramObj, 'ProdTest');
  }

  getMaterialReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetMaterialReport', 'GET', paramObj, 'ProdTest');
  }

  getSubMaterialsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetSubMaterialsbyTicketDetails', 'GET', paramObj, 'ProdTest');
  }

  getVoidTicketReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetVoidTicketData', 'GET', paramObj, 'ProdTest');
  }

  getPaymentReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetPaymentReportRpt', 'GET', paramObj, 'ProdTest');
  }

  getAccountingReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAccountReport', 'GET', paramObj, 'ProdTest');
  }
    
}
