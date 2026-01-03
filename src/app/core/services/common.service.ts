import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable, of, EMPTY, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { CheckoutSession } from '../interfaces/checkout-session.model';

declare const Stripe: any;

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
    callAPI(path: string, method: string, requestObj?: any,clientName?: any, postParams?: any): Observable<any> {
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
            observe: 'response',
            params: postParams
        });
    } else if (method === 'PUT') {
        return this.http.put<any>(productionURL, requestObj, {
            headers: httpHeader,
            observe: 'response'
        });
    } else if (method === 'DELETE') {
      return this.http.delete<any>(productionURL, {
          headers: httpHeader,
          observe: 'response',
          params: requestObj
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
        htmlAttr?.classList.add("add-footer");
        // Code to run when data-sidenav-size is 'condensed'
        console.log('Sidenav size is condensed');
      } else if (sidenavSize === 'default') {
        htmlAttr?.setAttribute('data-sidenav-size', 'condensed');
        htmlAttr?.classList.remove("add-footer");
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
  
  getNumberFromLocalStorage(val: any) {
    return (val==null || isNaN(+val)) ? val  : +val;
  }

  validateOrgCredentials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/ValidateCredentials', 'POST' , requestObj);
  }

  validateUserCredentials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/UserAuthentication', 'POST', requestObj);
  }

  
  UserLogout(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/UserLogout', 'POST', requestObj);
  }

  GetSuperAdminAuthenticate(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/GetSuperAdminAuthenticate', 'GET', paramObj);
  }

  GetAllOrganisations(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/GetAllOrganisations', 'GET', paramObj);
  }

  GetAllDeletedOrganisations(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/GetAllDeletedOrganisations', 'GET', paramObj);
  }

  getAdminOrganisaction(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/GetAdminOrganisaction', 'GET', paramObj);
  }

  getRestoreOrganisation(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/RestoreOrganisation', 'GET', paramObj);
  }

  UpdateLastLoginDate(requestObj: any,postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/UpdateLastLoginDate', 'POST', requestObj, null , postParams);
  }

  InsertUpdateSuperAdminDTO(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Users/InsertUpdateSuperAdminDTO', 'POST', requestObj);
  }

  insertConsentdetail(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Consent/Insertconsentdetail', 'POST', requestObj);
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

  UpdateCashDrawerStatus(requestObj: any,postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/UpdateCashDrawerStatus', 'POST', requestObj, null , postParams);
  }

  InsertMultipleCashDrawers(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/InsertMultipleCashDrawers', 'POST', requestObj);
  }

  GetAllCashDrawers(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetAllCashDrawers', 'GET', paramObj);
  }

  DeleteCashDrawerbyId(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/DeleteCashDrawerbyId', 'DELETE', requestObj);
  }

  InsertUpdateUSerCashDrawers(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/InsertUpdateUSerCashDrawers', 'POST', requestObj);
  }

  GetCashDrawerByUserID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/CashDrawers/GetCashDrawerByUserID', 'GET', paramObj);
  }

  
  InsertUpdateMaterialDocuments(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InsertUpdateMaterialDocuments', 'POST', requestObj);
  }

  GetMaterialDocumnetsByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/GetMaterialDocumnetsByID', 'GET', paramObj);
  }

   DeleteMaterialCertificateId(params: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/DeleteMaterialCertificateId', 'DELETE', params);
  }



  getAllTicketsDetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsDetails', 'GET', paramObj);
  }

  UpdateCheckByRowId(requestObj: any, postParams: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/UpdateCheckByRowId', 'POST', requestObj, null , postParams);
  }


  

  GetAllInvoiceDetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/GetAllInvoiceDetails', 'GET', paramObj);
  }

  GetInvoiceMaterialsDetailsByInvoiceId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InvoiceTransactionMaster/GetInvoiceMaterialsDetailsByInvoiceId', 'GET', paramObj);
  }

  insertUpdateInvoice(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/InsertUpdateInvoice', 'POST', requestObj);
  }

  insertInvoiceTransactions(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/InsertInvoiceTransactions', 'POST', requestObj);
  }

  GetAllInvoicesTransactionsByInvoiceId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/GetAllInvoicesTransactionsByInvoiceId', 'GET', paramObj);
  }
  
  restoreVoidInvoice(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/RestoreVoidInvoice', 'POST', requestObj);
  }

  voidCopyInvoice(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/VoidCopyInvoice', 'POST', requestObj);
  }

  UpdateIsMarkAsPaid(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/UpdateIsMarkAsPaid', 'POST', requestObj);
  }

  GetAllInvoiceTypes(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/GetAllInvoiceTypes', 'GET', paramObj);
  }

  GetAllSearchInvoiceTypes(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/GetAllSearchInvoiceTypes', 'GET', paramObj);
  }
  
  getAllTicketsByParentID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsByParentID', 'GET', paramObj);
  }

  getAllTicketsTransactionsByTicketId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketsTransactionsByTicketId', 'GET', paramObj);
  }

  GetAllTicketTypes(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketTypes', 'GET', paramObj);
  }

  GetAllSearchTicketTypes(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllSearchTicketTypes', 'GET', paramObj);
  }

  GetAllTicketScaleTypes(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllTicketScaleTypes', 'GET', paramObj);
  }

  insertUpdateTickets(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/InsertUpdateTickets', 'POST', requestObj);
  }

  insertUpdateMergeTickets(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/InsertUpdateMergeTickets', 'POST', requestObj);
  }

  voidCopyTickets(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/VoidCopyTickets', 'POST', requestObj);
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

  getLeadsOnlineData(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetLeadsOnlineData', 'GET', paramObj);
  }


  getCsvpaymentsData(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCsvDataForPayments', 'GET', paramObj);
  }


  getAllsellersDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetAllsellersDetails', 'GET', pagination);
  }

  getSellerById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetSellerById', 'GET', paramObj);
  }

  GetCustomerAdvance(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/GetCustomerAdvance', 'GET', paramObj);
  }

  FingerPrintandSignatureDownloadExe(paramObj: any): Observable<Blob> {
    const params = new HttpParams({ fromObject: paramObj });
    return this.http.get(environment.baseUrl + '/Sellerss/FingerPrintandSignatureDownloadExe', {
      params,
      responseType: 'blob' 
    });
  }


  InsertMultipleAddress(paramObj: any,postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InsertMultipleAddress', 'POST',  paramObj, null , postParams);
  }

  GetAddressesByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/GetAddressesByID', 'GET', paramObj);
  }

  DeleteAddressbyId(params: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/DeleteAddressbyId', 'DELETE', params);
  }

  InsertBusinessCertificates(postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InsertBusinessCertificates', 'POST',  null, null , postParams);
  }

  GetBusinessCertificatesByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/GetBusinessCertificatesByID', 'GET', paramObj);
  }
  
  DeleteCertificatebyId(params: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/DeleteCertificatebyId', 'DELETE', params);
  }





  GetAllPickUpDetailsByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Pickup/GetPickUpDetailsByID', 'GET', paramObj);
  }

  GetAllPickUpMaterialByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Pickup/GetAllPickUpMaterialByID', 'GET', paramObj);
  }


  GetAllDispatchTypes(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Pickup/GetAllDispatchTypes', 'GET', paramObj);
  }

  DeletePickUpbyId(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/DeletePickUpbyId', 'DELETE', requestObj);
  }

  DeletePickUpMaterialbyId(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/DeletePickUpMaterialbyId', 'DELETE', requestObj);
  }

  GetAllContainerLocations(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Pickup/GetAllContainerLocations', 'GET', paramObj);
  }

  GetContainerLocationsById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Pickup/GetContainerLocationsById', 'GET', paramObj);
  }

  UpdateDispatchDateDispatch(requestObj: any, postParams: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/UpdateDispatchDateDispatch', 'POST', requestObj, null , postParams);
  }




  addSeller(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/InsertSellerDTO', 'POST', requestObj);
  }




  DeleteSellerbyId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/DeleteSellerbyId', 'POST', null, localStorage.getItem('orgName') || "", paramObj);
  }

  InsertCustomerAdvance(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Sellerss/InsertCustomerAdvance', 'POST', requestObj);
  }

  
  GetTicketMaterialsDetailsByTicketId(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/TransactionMasters/GetTicketMaterialsDetailsByTicketId', 'GET', paramObj);
  }

  getAllPaymentType(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/TransactionMasters/GetAllPaymentsTypes', 'GET', paramObj);
  }

  getAllGroupMaterial(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllGroupMaterial', 'GET', paramObj);
  }

  insertUpdateGroupMaterials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/InsertUpdateGroupMaterials', 'POST', requestObj);
  }

  updateBulkSubMaterial(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/UpdateBulkSubMaterial', 'POST', requestObj);
  }

  getSubMaterials(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetSubMaterials', 'GET', paramObj);
  } 

  getSubMaterialByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetSubMaterialByID', 'GET', paramObj);
  } 


  getAllSubMaterials(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllSubMaterials', 'GET', paramObj);
  }  

  insertUpdateMaterials(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/InsertUpdateMaterials', 'POST', requestObj);
  }

  GetAllUOM(): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllUOM', 'GET');
  }


  GetAllAdjustmentType(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Adjustments/GetAllAdjustmentType', 'GET', paramObj);
  }

  GetAllContainer(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Container/GetAllContainer', 'GET', paramObj);
  }

  GetAllSubContainersByContainerID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Container/GetAllSubContainersByContainerID', 'GET', paramObj);
  }



  insertUpdateGroupAdjustment(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Adjustments/InsertUpdateGroupAdjustment', 'POST', requestObj);
  }
  InsertUpdatePickup(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/InsertUpdatePickup', 'POST', requestObj);
  }
  
  DispatchCloseDateUpdate(requestObj: any,postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/DispatchCloseDateUpdate', 'POST', requestObj, null , postParams);
  }

  UpdateMaterialCompletedStatus(requestObj: any,postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/UpdateMaterialCompletedStatus', 'POST', requestObj, null , postParams);
  }  

  

  InsertUpdateContainert(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Container/InsertUpdateContainert', 'POST', requestObj);
  }

  InsertUpdateContainerMaster(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Container/InsertUpdateContainerMaster', 'POST', requestObj);
  }

  getAllShipOutDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetAllShipOutDetails', 'GET', pagination);
  }

  getShipOutDetailsByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetShipOutDetailsByID', 'GET', paramObj);
  }

  getShipOutMaterialbyID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/GetShipOutMaterialbyID', 'GET', paramObj);
  }

  insertShipOutDTO(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/InsertShipOutDTO', 'POST', requestObj);
  }

  UpdateShipOutStatus(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/ShipOuts/UpdateShipOutStatus', 'GET',paramObj);
  }


  // InOut
  

  getAllInoutDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InOut/GetAllInOutDetails', 'GET', pagination);
  }

  getInoutDetailsByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InOut/GetInOutDetailsByID', 'GET', paramObj);
  }

  getInoutMaterialbyID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InOut/GetInOutMaterialbyID', 'GET', paramObj);
  }

  insertInoutDTO(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InOut/InsertInOutDTO', 'POST', requestObj);
  }

  UpdateInoutStatus(paramObj: any, postParams: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InOut/UpdateInwardStatus', 'POST',paramObj, null , postParams);
  }

  DeleteInoutbyId(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/InOut/DeleteInoutbyId', 'DELETE', requestObj);
  }





  getAllCODTickets(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/GetAllCODTickets', 'GET', pagination);
  }

  GetAllPickUpDetails(pagination: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PickUp/GetAllPickUpDetails', 'GET', pagination);
  }


   

  CODCloseUpdate(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/CODCloseUpdate', 'GET', paramObj);
  }

  GetOrganisationConsent(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Consent/GetOrganisationConsent', 'GET', paramObj);
  }

  GetConsentDetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Consent/GetConsentDetails', 'GET',paramObj);
  }



  

  

  MaterialCODImageUpdate(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Materialss/MaterialCODImageUpdate', 'POST', requestObj);
  }

  /** settings page */

  getAllSettingsTicketDetails(paramObj: any){
    return this.callAPI(environment.baseUrl + '/Settingss/GetAllTicketDetails', 'GET', paramObj);
  }

  InsertUpdateTicketSettings(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/InsertUpdateTicketSettings', 'POST', requestObj);
  }

  InsertUpdateCurrencyModule(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/InsertUpdateCurrencyModule', 'POST', requestObj);
  }

  GetAllCurrencyModule(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/GetAllCurrencyModule', 'GET', paramObj);
  }

  GetCurrencyByModule(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/GetCurrencyByModule', 'GET', paramObj);
  }


  DeleteCurrencyModuleById(params: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Settingss/DeleteCurrencyModuleById', 'DELETE', params);
  }

  GetSystemPreferencesValue(paramObj: any){
    return this.callAPI(environment.baseUrl + '/SystemPreferences/GetSystemPreferencesValue', 'GET', paramObj);
  }
  
  InsertUpdateSystemPreferences(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/SystemPreferences/InsertUpdateSystemPreferences', 'POST', requestObj);
  }
  

  sendMaterialPriseList(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/SendPriceList', 'GET', paramObj);
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
    return this.callAPI(environment.baseUrl + '/Reports/GetAccountingReportAverage', 'GET', paramObj);
  }
  getProfitAndLossReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetProfitAndLossReport', 'GET', paramObj);
  }

  //For ShipOut report
  getShipOutReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllShipOutReport', 'GET', paramObj);
  }

  //InOut report
  getInOutReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllInOutReport', 'GET', paramObj);
  }

  //Dispatch Report
  getDispatchReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllDispatchReport', 'GET', paramObj);
  }

  //For MAterial Price List
  getMaterialPriceList(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetAllSubMaterial', 'GET', paramObj);
  }

  getAllAdvanceReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllCustomerAdvanceReportData', 'GET', paramObj);
  }
  
  /** Pdf Reports */

  generateDailyTicketsReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetDailyTicketData', 'GET', paramObj);
  }

  generateSingleTicketReport(paramObj: any, isParent: boolean): Observable<any> {
    if (isParent)
      return this.callAPI(environment.baseUrl + '/PdfReports/GetMergeTransactionsTicketReceipt', 'GET', paramObj);
    else 
      return this.callAPI(environment.baseUrl + '/PdfReports/GetTransactionsTicketReceipt', 'GET', paramObj);
  }
  generateSingleTicketReportSota(paramObj: any, isParent: boolean): Observable<any> {
    if (isParent)
      return this.callAPI(environment.baseUrl + '/PdfReports/GetMergeTicketDataSota', 'GET', paramObj);
    else 
      return this.callAPI(environment.baseUrl + '/PdfReports/GetSingleTicketDataSota', 'GET', paramObj);
  }

  generateInventoryReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetAllInventoryReport', 'GET', paramObj);
  }

  getCheckPrintReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCheckPrintReport', 'GET', paramObj);
  }

  generateCashDrawerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCashDrawerReportData', 'GET', paramObj);
  }

  GetCashDrawerCombinedReportData(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCashDrawerCombinedReportData', 'GET', paramObj);
  }
  generateContainerTrackingReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetAllContainerLocationsReportData', 'GET', paramObj);
  }
  
  generateCustomerReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCustomerData', 'GET', paramObj);
  }

  GetMainAndSubMaterials(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Materialss/GetMainAndSubMaterials', 'GET', paramObj);
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

  getSellerInfo(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetSellerInfo', 'GET', paramObj);
  }

  getShipOutReportByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetShipOutDetailsByID', 'GET', paramObj);
  }

  getInoutReportByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetInOutDetailsByID', 'GET', paramObj);
  }

  getMergeTransactionsTicketReceipt(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetMergeTransactionsTicketReceipt', 'GET', paramObj);
  }

  getMergeTransactionsTicketReceiptSota(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetMergeTicketDataSota', 'GET', paramObj);
  }

  getCashdrawerReceipt(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCashdrawerReceipt', 'GET', paramObj);
  }

  getCODTicketReceipt(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCODTicketReceipt', 'GET', paramObj);
  }

  generateSingleInvoiceReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetSingleInvoiceData', 'GET', paramObj);
  }

  getDispatchReportData(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetDispatchReportData', 'GET', paramObj);
  }

  getMaterialPricelistReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetMaterialPricelist', 'GET', paramObj);
  }
  
  getAccountingDataReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/AccountingDataReport', 'GET', paramObj);
  }

  getProfitAndLossDataReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/ProfitAndDataReport', 'GET', paramObj);
  }

  getPurchaseReportByID(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetPurchaseOrderDetailsByID', 'GET', paramObj);
  }

  sendInvoice(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Invoice/SendInvoice', 'GET', paramObj);
  }

  GetMaterialDetailsByBarcode(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetMaterialDetailsByBarcode', 'GET', paramObj);
  }

  GetCustomerAdvanceReceipt(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/GetCustomerAdvanceReceipt', 'GET', paramObj);
  }
  
  GetAdvanceReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PdfReports/rptGetAllCustomerAdvanceReportData', 'GET', paramObj);
  }
  
  /*
  Reward Program
  */ 
 InsertUpdateRewards(requestObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/Reward/InsertUpdateRewards', 'POST', requestObj);
}
GetAllRewards(paramObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/Reward/GetAllRewards', 'GET', paramObj);
}
DeleteRewardbyId(requestObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/Reward/DeleteRewardbyId', 'DELETE', requestObj);
}
GetCustomerRedemptionByID(paramObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/Reward/GetCustomerRedemptionByID', 'GET', paramObj);
}
GiveCoupens(requestObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/Reward/GiveCoupens', 'POST', requestObj);
}

/* Scale Machines */
GetAllScales(paramObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/ScaleMachines/GetAllScaleMachines', 'GET', paramObj);
}
InsertUpdateScales(requestObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/ScaleMachines/InsertUpdateScaleMachines', 'POST', requestObj);
}
DeleteScalebyId(requestObj: any): Observable<any> {
  return this.callAPI(environment.baseUrl + '/ScaleMachines/DeleteScalebyId', 'DELETE', requestObj);
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

  InsertUpdateUserShifts(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/InsertUpdateUserShifts', 'POST', requestObj);
  }

  GetUserShifts(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/GetUserShifts', 'GET', paramObj);
  }

  DeleteUserShiftDTO(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/DeleteUserShiftDTO', 'POST', requestObj);
  }


  DeleteUserDTO(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Users/DeleteUserDTO', 'POST', requestObj);
  }

  GetLocations(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Locations/GetLocations', 'GET', paramObj);
  }

  UpdateLocationTimeZone(requestObj:any, postParams:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Locations/UpdateLocationTimeZone', 'POST', requestObj, null , postParams);
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

  ExtractOCRData(requestObj:any): Observable<any>{
    return this.http.post(environment.ocrUrl + '/process-image/', requestObj);
  }

  /* Regrades API */  

  GetAllRegrades(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Regrades/GetAllRegrades', 'GET', paramObj);
  }

  GetRegradedMaterialsById(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Regrades/GetRegradedMaterialsById', 'GET', paramObj);
  }

  InsertUpdateRegradedMaterials(requestObj:any, postParams: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Regrades/InsertUpdateRegradedMaterials', 'POST', requestObj, null , postParams);
  }
  
  UpdateRegradedStatus(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Regrades/UpdateRegradedStatus', 'POST', null , null, paramObj);
  }

  ticketEditMode(postParams:any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Tickets/UpdateTicketEditMode', 'POST',  null, null , postParams);
  }

  getContainerTrackingReport(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Reports/GetAllContainerTrackingReport', 'GET', paramObj);
  }
  
  paySubscriptionFee(requestObj: any): Observable<any> {
    requestObj.callbackUrl = this.buildCallbackUrl();
    return this.callAPI(environment.baseUrl + '/Payment/CreateCheckoutSession', 'POST', requestObj);
  }


  //Feed back and Sugession
  getFeedbackSuggestions(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/FeedbackSuggestions/GetAllDetails', 'GET', paramObj);
  }

  redirectToCheckout(session: CheckoutSession) {

      const stripe = Stripe(session.stripePublicKey);

      stripe.redirectToCheckout({
          sessionId: session.stripeCheckoutSessionId
      });
  }
    
  buildCallbackUrl() {

    const protocol = window.location.protocol,
        hostName = window.location.hostname,
        port = window.location.port;

    let callBackUrl = `${protocol}//${hostName}`;

    if (port) {
        callBackUrl += ":" + port;
    }

    callBackUrl+= "/stripe-checkout";

    return callBackUrl;
  }


  getFileData(url: string) {
    return this.http.get(url, { responseType: 'arraybuffer' });
  }


  getAllSubscriptionPlan(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllSubscriptionPlan', 'GET', paramObj);
  }

  getAllExtraTicketPlans(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllExtraTicketPlans', 'GET', paramObj);
  }

  getAllOrganisationPlanDetails(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllOrganisationPlanDetails', 'GET', paramObj);
  }

  getAllCurrency(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllCurrency', 'GET', paramObj);
  }

  getAllTimeZones(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllTimeZones', 'GET', paramObj);
  }

  GetAllCountry(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllCountry', 'GET', paramObj);
  }

  GetAllCity(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllCity', 'GET', paramObj);
  }
  
  GetAllState(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllState', 'GET', paramObj);
  }

  GetAllModule(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/GetAllModule', 'GET', paramObj);
  }

  getAllOrganisationPlanName(paramObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Organisations/GetOrganisactionPlanByName', 'GET', paramObj);
  }


  sendOTPEmail(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Emails/SendOTPEmail', 'POST', requestObj);
  }

  VerifyOTP(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Emails/VerifyOTP', 'POST', requestObj);
  }


  createOrganisationViaWeb(requestObj:any):Observable<any>{ 
    return this.callAPI(environment.baseUrl + '/Organisations/CreateOrganisationViaWeb', 'POST', requestObj);

  }

  InsertOrganisationDTO(requestObj:any):Observable<any>{ 
    return this.callAPI(environment.baseUrl + '/Organisations/InsertOrganisationDTO', 'POST', requestObj);

  }

  GetOrganisactionPasswordByName(paramObj:any):Observable<any>{ 
    return this.callAPI(environment.baseUrl + '/Organisations/GetOrganisactionPasswordByName', 'GET', paramObj);

  }
  GetUserPassById(paramObj:any):Observable<any>{ 
    return this.callAPI(environment.baseUrl + '/Users/GetUserPassById', 'GET', paramObj);

  }

  

  UpdateOrganizationPassword(requestObj:any):Observable<any>{ 
    return this.callAPI(environment.baseUrl + '/Organisations/updateOrganizationPassword', 'POST', requestObj);

  }

  UpdateUserPassword(requestObj:any):Observable<any>{ 
    return this.callAPI(environment.baseUrl + '/Users/UpdateUserPassword', 'POST', requestObj);

  }


  getAllCountry(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/GetAllCountry', 'GET', paramObj);
  }

  getAllState(paramObj: any): Observable<any>{
      return this.callAPI(environment.baseUrl + '/Master/GetAllState', 'GET', paramObj);
  }

  getAllCity(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/GetAllCity', 'GET', paramObj);
  }

  InsertUpdateCountry(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/InsertUpdateCountry', 'POST', requestObj);
  }

  InsertUpdateState(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/InsertUpdateStates', 'POST', requestObj);
  }
  
  InsertUpdateCity(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/InsertUpdateCity', 'POST', requestObj);
  }

  InsertUpdateCurrency(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/InsertUpdateCurrency', 'POST', requestObj);
  }

  DeleteCurrencyId(params: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/Master/DeleteCurrencyId', 'DELETE', params);
  }



  getAllStateByCountryID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/Master/GetStateByCountryID', 'GET', paramObj);
  }

  InsertUpdatePriceKeySettings(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PriceKeySettingss/InsertUpdatePriceKeySettings', 'POST', requestObj);
  }

  ValidatePriceKeySettings(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PriceKeySettingss/ValidatePriceKeySettings', 'POST', requestObj);
  }

   InsertUpdateFeedbackandSuggestions(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/FeedbackSuggestions/InsertUpdateFeedbackandSuggestions', 'POST', requestObj);
  }

  //SalesOrder
  InsertUpdateSalesOrder(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/InsertUpdateSalesOrder', 'POST', requestObj);
  }

  GetAllSalesOrders(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/GetAllSalesOrders', 'GET', paramObj);
  }

  GetSalesOrderById(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/GetSalesOrderById', 'GET', paramObj);
  }

  GetSalesOrdersByCustomer(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/GetSalesOrdersByCustomer', 'GET', paramObj);
  }
  GetSalesOrderMaterialsBySalesOrderID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/GetSalesOrderMaterialsBySalesOrderID', 'GET', paramObj);
  }  

  GetSalesOrderMaterialsByCustomerAndMaterial(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/GetSalesOrderMaterialsByCustomerAndMaterial', 'GET', paramObj);
  } 
  
  GetShipOutsMaterialsBySalesOrderID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/GetShipOutsMaterialsBySalesOrderID', 'GET', paramObj);
  } 


  DeleteSalesOrderbyId(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/SalesOrderAPI/DeleteSalesOrderbyId', 'DELETE', requestObj);
  }

  //PurchaseOrder
  InsertUpdatePurchaseOrder(requestObj:any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/InsertUpdatePurchaseOrder', 'POST', requestObj);
  }

  GetAllPurchaseOrders(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/GetAllPurchaseOrders', 'GET', paramObj);
  }
  
  GetPurchaseOrderMaterialDetailsByPurchaseOrderID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/GetPurchaseOrderMaterialDetailsByPurchaseOrderID', 'GET', paramObj);
  }

  GetPurchaseOrderById(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/GetPurchaseOrderById', 'GET', paramObj);
  }

  GetPurchaseOrdersByCustomerID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/GetPurchaseOrdersByCustomerID', 'GET', paramObj);
  }

  GetPurchaseOrderMaterialsByCustomerAndMaterial(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/GetPurchaseOrderMaterialsByCustomerAndMaterial', 'GET', paramObj);
  } 

  GetTicketsMaterialsByPurchaseOrderID(paramObj: any): Observable<any>{
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/GetTicketsMaterialsByPurchaseOrderID', 'GET', paramObj);
  }

  DeletePurchaseOrderbyId(requestObj: any): Observable<any> {
    return this.callAPI(environment.baseUrl + '/PurchaseOrderAPI/DeletePurchaseOrderbyId', 'DELETE', requestObj);
  }
  // http://18.222.119.98/process-image/
    


//   //{{BaseURL}}/Master/GetAllCountry?CountryID=0
// {{BaseURL}}/Master/GetAllState?CountryID=1&StateID=0 
// {{BaseURL}}/Master/GetAllCity?CountryID=1&StateID=1&CityID=0


  /**
   * Sends an image file to the ML model for material prediction.
   * @param formData The form data containing the image file to be predicted.
   * @returns An observable with the prediction results from the ML model.
   */
  predictMaterial(formData: FormData): Observable<any> {
    // This URL points to your Python ML model.
    // It is highly recommended to move this URL into your environment.ts file.
    const mlModelUrl = 'http://localhost:8000/predict/';

    // We use a direct HttpClient call here because the Content-Type needs to be 'multipart/form-data'.
    // The generic `callAPI` method in this service is configured for 'application/json'.
    // HttpClient will automatically set the correct Content-Type header when the body is a FormData object.
    return this.http.post<any>(mlModelUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error from ML prediction API:', error);
        // Returning of(null) to be consistent with the service's existing error handling pattern,
        // which prevents the error from crashing the subscription.
        return of(null);
      })
    );
  }

  /**
   * Fetches the full details of a material by its name.
   * This is used after getting a prediction from the ML model to get pricing, group, etc.
   * @param paramObj An object containing the materialName and LocationId. e.g., { materialName: 'Aluminium', LocationId: 1 }
   * @returns An observable with the material's details.
   */
  getMaterialByName(paramObj: any): Observable<any> {
    // NOTE: The backend endpoint '/Materialss/GetMaterialByName' is an assumption based on your other API paths.
    // You will need to implement this endpoint in your backend application.
    // It should be able to find and return a material's data based on its name and location.
    return this.callAPI(environment.baseUrl + '/Materialss/GetMaterialByName', 'GET', paramObj);
  }

  
    
}
