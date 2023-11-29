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
  dataTableConfig:any  = {
    pageOptions:[10, 25, 50,100]
  }
  
  private _status = true;
  constructor(private http: HttpClient,private localService:StorageService) { }

  /* GET: get the data for type ahead select dropdown based on key passed*/
    callAPI(path: string, method: string, requestObj?: any, clientName?: string): Observable<any> {
    let httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
    });

    // const userToken = this.localService.getLocalStorage('orgName');
    const organizationName = '' || localStorage.getItem('orgName');

    if (clientName) {
      httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'ClientName': clientName
      });
    } else if (organizationName) {
      httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'ClientName': organizationName
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

  get tableConfig(){
    return this.dataTableConfig
  }

  private handleError(error: HttpErrorResponse) {
    return null; //throwError(error);
  }

  showHidePanel(menuStatus:any){
    
    
   
    let htmlAttr = document.querySelector('html');
    

    const htmlElement = document.documentElement;

    // Get the value of the data-sidenav-size attribute
    const sidenavSize = htmlElement.getAttribute('data-sidenav-size');

    // Check the value and add your condition

    if(menuStatus=='header'){
      if (sidenavSize === 'condensed') {
      
        htmlAttr?.setAttribute('data-sidenav-size', 'default');
        // Code to run when data-sidenav-size is 'condensed'
        console.log('Sidenav size is condensed');
      } else if (sidenavSize === 'default') {
        htmlAttr?.setAttribute('data-sidenav-size', 'condensed');
      } else {
        // Code for other values, or handle as needed
        htmlAttr?.setAttribute('data-sidenav-size', 'default');
      }
  
    }else{
      htmlAttr?.setAttribute('data-sidenav-size', 'condensed');
    }
  

    // if(htmlAttr){
    //   htmlAttr.setAttribute('data-sidenav-size', menuStatus);

    // }
   
  
  }


  getProbablyNumberFromLocalStorage(key: any) {
    var val = localStorage.getItem(key);
    return (val==null || isNaN(+val)) ? val  : +val;
  }

  validateOrgCredentials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/ValidateCredentials', 'POST' , requestObj);
  }

  validateUserCredentials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/UserAuthentication', 'POST', requestObj);
  }

  getOrgLocation(): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Locations/GetAllLocatoins', 'GET', null);
  }

  getCashdrawerdetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashdrawerdetails', 'GET', paramObj);
  }

  getCashDrawerAmountDTO(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashDrawerAmountDTO', 'GET', paramObj);
  }

  getCashDrawerAmountAndPaidTicketCount(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashDrawerAmountAndPaidTicketCount', 'GET', paramObj);
  }

  insertUpdateCashDrawerTransactions(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/InsertUpdateCashDrawerTransactions', 'POST', requestObj);
  }

  insertCashDrawerDetails(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/InsertCashDrawerDetails', 'POST', requestObj);
  }

  getAllTicketsDetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsDetails', 'GET', paramObj);
  }

  getAllTicketsByParentID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsByParentID', 'GET', paramObj);
  }

  getAllTicketsTransactionsByTicketId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsTransactionsByTicketId', 'GET', paramObj);
  }

  insertUpdateTickets(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/InsertUpdateTickets', 'POST', requestObj);
  }

  insertTicketTransactions(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/InsertTicketTransactions', 'POST', requestObj);
  }

  getAllTicketsBySellerId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsBySellerId', 'GET', paramObj);
  }

  RestoreVoidTickets(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/RestoreVoidTickets', 'POST', requestObj);
  }

  getAllsellersDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetAllsellersDetails', 'GET', pagination);
  }

  getSellerById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetSellerById', 'GET', paramObj);
  }

  addSeller(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/InsertSellerDTO', 'POST', requestObj);
  }
  
  getTransactionsDetailsById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/TransactionMasters/GetTicketMaterialsDetailsByTicketId', 'GET', paramObj);
  }

  getAllGroupMaterial(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllGroupMaterial', 'GET', paramObj);
  }

  insertUpdateGroupMaterials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/InsertUpdateGroupMaterials', 'POST', requestObj);
  }

  getAllSubMaterials(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllSubMaterials', 'GET', paramObj);
  }  

  insertUpdateMaterials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/InsertUpdateMaterials', 'POST', requestObj);
  }

  GetAllAdjustmentType(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Adjustments/GetAllAdjustmentType', 'GET', paramObj);
  }

  insertUpdateGroupAdjustment(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Adjustments/InsertUpdateGroupAdjustment', 'POST', requestObj);
  }

  getAllShipOutDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetAllShipOutDetails', 'GET', pagination);
  }

  getShipOutDetailsByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetShipOutDetailsByID', 'GET', paramObj);
  }

  getAllCODTickets(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllCODTickets', 'GET', pagination);
  }

  /** settings page */

  getAllSettingsTicketDetails(paramObj: any){
    return this.callAPI(environment.baseUrl + '/Settingss/GetAllTicketDetails', 'GET', paramObj);
  }

  InsertUpdateTicketSettings(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/InsertUpdateTicketSettings', 'POST', requestObj);
  }

  GetSystemPreferencesValue(paramObj: any){
    return this.callAPI(environment.baseUrl + '/SystemPreferences/GetSystemPreferencesValue', 'GET', paramObj);
  }
  
  InsertUpdateSystemPreferences(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/SystemPreferences/InsertUpdateSystemPreferences', 'POST', requestObj);
  }
  
  /** Reports */

  getDailyTicketsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllTicketsForDailyReport', 'GET', paramObj);
  }

  getSingleTicketReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllTicketsDetails', 'GET', paramObj);
  }

  getInventoryReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllInventoryReport', 'GET', paramObj);
  }

  getCashDrawerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetCashDrawerReportDataShow', 'GET', paramObj);
  }

  getCustomerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllSellersofReport', 'GET', paramObj);
  }

  getMaterialReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetMaterialReport', 'GET', paramObj);
  }

  getSubMaterialsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetSubMaterialsbyTicketDetails', 'GET', paramObj);
  }

  getVoidTicketReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetVoidTicketData', 'GET', paramObj);
  }

  getPaymentReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetPaymentReportRpt', 'GET', paramObj);
  }

  getAccountingReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAccountReport', 'GET', paramObj);
  }


  /** Pdf Reports */

  generateDailyTicketsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetAllTicketsForDailyReport', 'GET', paramObj);
  }

  generateSingleTicketReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetTransactionsTicketReceipt', 'GET', paramObj);
  }

  generateInventoryReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetAllInventoryReport', 'GET', paramObj);
  }

  generateCashDrawerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCashDrawerReportData', 'GET', paramObj);
  }

  generateCustomerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCustomerData', 'GET', paramObj);
  }

  generateMaterialReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetMaterialReportData', 'GET', paramObj);
  }

  generateSubMaterialsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetSubMaterialReport', 'GET', paramObj);
  }

  generateVoidTicketReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetVoidTicketDataReport', 'GET', paramObj);
  }

  generatePaymentReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetPaymentReportRpt', 'GET', paramObj);
  }

  generateAccountingReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAccountReport', 'GET', paramObj);
  }

  /** Admin API */

  GetAllUsers(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/GetAllUsers', 'GET', paramObj);
  }

  GetAllUsersRoles(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/GetAllUsersRoles', 'GET', paramObj);
  }

  InsertUpdateUserDTO(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/InsertUpdateUserDTO', 'POST', requestObj);
  }

  DeleteUserDTO(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/DeleteUserDTO', 'POST', requestObj);
  }

  GetLocations(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Locations/GetLocations', 'GET', paramObj);
  }

  
  GetCODImagesbyID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Tickets/GetCODImagesbyID', 'GET', paramObj);
  }
  GetAllLocatoins(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Locations/GetAllLocatoins', 'GET', paramObj);
  }

  InsertUpdateLocationDTO(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Locations/InsertUpdateLocationDTO', 'POST', requestObj);
  }

  FileUploadFromWeb(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/AWS/FileUploadFromWeb', 'POST', requestObj);
  }



  getFileData(url: string) {
    return this.http.get(url, { responseType: 'arraybuffer' });
  }
    
}
