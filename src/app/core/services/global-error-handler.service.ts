import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  errorMessage: string = '';

  constructor(private injector: Injector, private commonService: CommonService) { }

  handleError(error: any) {
    const routerLink = this.injector.get(Router);
    this.errorMessage = 'Global Error Logger :: URL : ' + routerLink.url + ' == ' + new Date().toUTCString() + ' == ' ;

    if (error instanceof HttpErrorResponse) {
        // Backend returns unsuccessful response codes such as 404, 500 etc.
        this.errorMessage = this.errorMessage + 'Backend returned status code: ' + error.status;
        this.errorMessage = this.errorMessage + ' == Response body:' + error.message;
    } else {
        // A client-side or network error occurred.
        this.errorMessage = this.errorMessage + 'An error occurred:' + error.message;
    }

    // Logger API Integration
    // return this.commonService.callAPI('/api/Logger/LogFrontEndException', 'POST', { 'message' : this.errorMessage });
  }
}
