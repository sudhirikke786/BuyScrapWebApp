import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable, of, EMPTY, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  
  configJson: any;

  constructor(private http: HttpClient) { }

  /* GET: get the data for type ahead select dropdown based on key passed*/
  callAPI(path: string, method: string, requestObj?: any, clientName?: string): Observable<any> {
    let httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
    });

    if (clientName) {
      httpHeader = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'ClientName': clientName
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
    
}
