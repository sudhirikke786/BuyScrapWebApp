import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable, of, EMPTY, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';


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
    return this.callAPI('https://localhost:44385/Organisations/ValidateCredentials', 'POST' , requestObj);
  }

  validateUserCredentials(requestObj: any): Observable<any> {
    return this.callAPI('https://localhost:44385/Users/UserAuthentication', 'POST', requestObj, 'ProdTest');
  }

  getOrgLocation(): Observable<any> {
    return this.callAPI('https://localhost:44385/Locations/GetAllLocatoins', 'GET', null, 'ProdTest');
  }  

  getAllTicketsDetails(pagination: any): Observable<any> {
    return this.callAPI('https://localhost:44385/Tickets/GetAllTicketsDetails', 'GET', pagination, 'ProdTest');
  }
    
}
