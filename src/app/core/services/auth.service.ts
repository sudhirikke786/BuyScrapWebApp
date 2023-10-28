import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Observable, pipe, throwError} from 'rxjs';
import {map, tap, catchError, share} from 'rxjs/operators';


import { CommonService } from './common.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private message: string = '';
  private tokenData: any;
  private configJson: any;

  public currentToken: string = '';

  constructor(private http: HttpClient,
              private localStorage:StorageService,
              public commonService: CommonService) {
    // this.configJson = commonService.getConfigJson();
  }

  /**
   * this is used to clear anything that needs to be removed
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * check for expiration and if token is still existing or not
   * @return {boolean}
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('access_token') != null && !this.isTokenExpired();
  }

  // check token is valid or not
  isTokenExpired(): boolean {
    return false;
  }

  /**
   * this is used to revoke the token in case of logout
   */
  revokeToken() {
    this.configJson = {}; //this.commonService.getConfigJson();
    this.currentToken = ''; //localStorage.getItem('access_token');
    const headers = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    const body = new HttpParams()
        .set('token', this.currentToken)
        .set('token_type_hint', 'access_token')
        .set('client_id', this.configJson['client_id'])
        .set('client_secret', this.configJson['client_secret']);
    this.http.post(this.configJson['revoketoken'], body, headers)
        .pipe(
            catchError(this.handleError)
        );
  }


  getAuthToken() {
      this.currentToken = ''; //localStorage.getItem('access_token');
      return this.currentToken;
  }

  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          return throwError('An error occurred:' + error.error.message);
      } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          return throwError(error);
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
  }

  /* POST: get token from the server */
  getToken() {
      this.configJson = {}; //this.commonService.getConfigJson();
      const headers = {
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      };
      const body = new HttpParams()
          .set('scope', this.configJson['scope'])
          .set('grant_type', this.configJson['grant_type'])
          .set('client_id', this.configJson['client_id'])
          .set('client_secret', this.configJson['client_secret'])
          .set('redirect_uri', location.origin);
      return this.http.post(this.configJson['token'], body, headers)
          .pipe(
              catchError(this.handleError)
          );
  }


  refreshToken() {
    this.configJson = {}; //this.commonService.getConfigJson();
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */

    const headers = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    const body = new HttpParams()
        .set('scope', this.configJson['scope'])
        .set('grant_type', this.configJson['grant_type'])
        .set('client_id', this.configJson['client_id'])
        .set('client_secret', this.configJson['client_secret'])
        .set('redirect_uri', location.origin);
    return this.http.post(this.configJson['token'], body, headers)
        .pipe(
            catchError(this.handleError)
        );

  }

  /**
   * this is used to clear local storage and also the route to home
   */
  logout() {
    // logout User on click of logout link when webseal authorisation fails and will get 400 status code

    localStorage.clear();
    window.location.assign(location.origin + '/pkmslogout');
  }


  /* set the data From token request */
  setTokenData(data: any) {
    this.tokenData = data;
  }

  /* get the data from token request */
  getTokenData() {
    return this.tokenData ? this.tokenData.access_token : '';
  }


  hasRoleActive(roleName:string):boolean{
     const userObj =  this.localStorage.getLocalStorage('userObj');
     return userObj?.userdto?.role?.includes(roleName);
  }




}
