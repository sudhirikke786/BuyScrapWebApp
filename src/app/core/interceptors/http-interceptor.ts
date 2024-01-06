import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { take, filter, catchError, switchMap } from 'rxjs/operators';
import { throwError as observableThrowError,  Subscription, Observable, BehaviorSubject } from 'rxjs';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse  } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(String.toString());
    tokenRequestSubscription: Subscription = new Subscription;
    callToken = true;

    constructor(private injector: Injector,
      private router: Router,
      private localService: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Show loader while requset get complete
        // this.commonService.hideLoader(false); // Commenting due to type ahead api call on touch
        // send cloned request with header to the next handler.
        return next.handle(this.addToken(req)).pipe(
          tap(data => {
            if (data instanceof HttpResponse) {
              if (data.url && data.url.indexOf('assets/config.json') > 0) {
                this.callToken = data.body.callToken;
              }
            }
          }),
          catchError(error => {
            // alert(JSON.stringify(error))
              if (error instanceof HttpErrorResponse) {
                  if (this.callToken === false && (<HttpErrorResponse>error).status === 200) {
                    // This if loop execute when WebSeal authentication failed and in response if we will get html content
                    return this.WebSealExpired();
                  }
                  switch ((<HttpErrorResponse>error).status) {
                      // case 200:
                      //   // This will be only applicable when we will bypass CA gateway. in case of CA gateway, this case is not required
                      //   return this.WebSealExpired();
                      case 400:
                          return this.handle400Error(req, error);
                      case 401:
                          return this.handle401Error(req, next);
                      case 406:
                          return this.handle406Error(req, next);
                      default:
                          return observableThrowError(error);
                  }
              } else {
                  return observableThrowError(error);
              }
          }));
    }

    /**
     * Checks WebApi Response object whether it contains JSON OBJECT or html
     * @param json
     * @returns type of param
     */
    // checkJSON(json) {
    //   if (typeof json === 'object') {
    //     return 'object';
    //   }

    //   try {
    //     return (typeof JSON.parse(json));
    //   } catch (e) {
    //     return 'string';
    //   }
    // }

  /**
   * Handle400s error
   * @param req
   * request object sent as one of the input paramter just to understand request url.
   * If token service will throw 400, in that scenario, we will logout the user
   * @param error
   * error object to make sure the status code thrown
   * @returns
   * Either logout the user and throw out of application or throw error object
   */
  handle400Error(req: HttpRequest<any>, error: any) {
    // alert('1111');
      // 400 Error thrown for Bad request
      if (error && error.status === 400 && req.url.indexOf('token') > 0) {
        // If we get a 400, the Web seal authorisation is no longer valid so logout.
        return this.logoutUser();
      } else if (error && error.status === 400 && error.error.error === 'webseal-authorization-error') {
        // Webseal Authorization failed. Cannot get information. Please check if the user or group has access to the API
        return this.logoutUser();
      } else if (error && error.status === 400 && this.callToken === false) {
        // This will get called when webSeal return 400 and when are bypass the CA gateway
        // Webseal Authorization failed. Cannot get information. Please check if the user or group has access to the API
        return this.WebSealExpired();
      } else {
        return observableThrowError(error);
      }
  }

  /**
   * Adds token to each request except token generation request
   * @param req
   * request object sent as one of the input paramter just to understand request url.
   * In case of token generation service, we will not set Bearer Authorization header
   * @returns request object with Authorization header
   */
  addToken(req: HttpRequest<any>): HttpRequest<any> {
    if ( (req.url.indexOf('token') > 0 && this.callToken !== false) || (this.callToken === false) || 
    (req.url.indexOf('GetAllLocatoins') > 0) || (req.url.indexOf('ValidateCredentials') > 0) || (req.url.indexOf('UserAuthentication') > 0) ) {
      return req.clone({ withCredentials: true });
    } else {      
      const userToken = this.localService.getLocalStorage('userObj');
      return req.clone({
        withCredentials: true,
        setHeaders: { Authorization: 'Bearer ' + userToken?.token }
      });
    }
  }

  /**
   * Handle401s error :: by giving call for token service for refresh token
   * @param req
   * request object sent as one of the input paramter to add authorisation header by accessing value stored in local storage.
   * @param next
   * will handle next service request after getting refresh token
   * @returns
   */
  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
      if (!this.isRefreshingToken && this.callToken !== false) {
          // This if block should execute in case of CA gateway integration to refresh token if token expired.
          this.isRefreshingToken = true;

          // Reset here so that the following requests wait until the token
          // comes back from the refreshToken call.
          // this.tokenSubject.next(null);

          const authService = this.injector.get(AuthService);

          return authService.refreshToken().pipe(
              switchMap((newToken: any) => {

                  // store the new tokens
                  localStorage.setItem('refresh_token', newToken['refresh_token']);
                  localStorage.setItem('access_token', newToken['access_token']);
                  if (newToken) {
                      this.tokenSubject.next(newToken);
                      return next.handle(this.addToken(this.getNewRequest(req)));
                  }

                  // alert('2222');
                  // If we don't get a new token, we are in trouble so logout.
                  return this.logoutUser();
              }),
              catchError(error => {
                // alert('3333');
                  // If there is an exception calling 'refreshToken', so throwing user out by calling logout.
                  return this.logoutUser();
              }),
              finalize(() => {
                  this.isRefreshingToken = false;
              }),);
      } else if (this.callToken !== false) {
          return this.tokenSubject.pipe(
              filter(token => token != null),
              switchMap(token => {
                  return next.handle(this.addToken(this.getNewRequest(req)));
              }),);
      } else {
        // This will get called when webSeal return 401 (in any case) and when are bypass the CA gateway
        return this.WebSealExpired();
      }
  }


  /*
      This method is only here so the example works.
      Do not include in your code, just use 'req' instead of 'this.getNewRequest(req)'.
  */
  getNewRequest(req: HttpRequest<any>): HttpRequest<any> {
    return req;
  }

  /**
   * Logouts user :: In case of WebSeal unauthorisation (400), we will have to logout the user.
   * If any service retun 401 (token expiration), we are calling service for refresh token at the same time if webSeal throw 400,
   * In this scenario, we will going to logout the user and return empty/blank error object.
   * @returns :: blank error object
   */
  logoutUser() {
      // Forcefully logout User when 400 status code gets fired

      // Route to the login page (implementation up to you)
      // const authService = this.injector.get(AuthService);
      // Currently CA gateway returing 400 if WebAPI is not found instead of 404
      // authService.logout();
      
      // localStorage.clear();
      // window.location.assign(location.origin + '/11');

      
      const orgName = localStorage.getItem('orgName');
      localStorage.removeItem('userObj');
      localStorage.removeItem('locId');
      this.router.navigateByUrl(`${orgName}/user-login`);

      return observableThrowError('');
  }

  handle406Error(req: HttpRequest<any>, error: any) {   
    localStorage.removeItem('userObj');
    localStorage.removeItem('locId');
    localStorage.removeItem('orgName');
    localStorage.removeItem('systemInfo');
    localStorage.removeItem('locationName');
      this.router.navigateByUrl(`organization-login`);
      return observableThrowError('');
  }

    /**
   * To handle WebSeal unauthorisation scenario, when we are bypassing CA gateway integration
   * @returns :: blank error object
   */
  WebSealExpired() {
    // Forcefully redirect to saneirp home page so, after webseal failed it will redirect to home page
    // from where it will redirect to login page for login
    window.location.assign(location.origin + '/saneirp/home');
    return observableThrowError('');
  }

}
