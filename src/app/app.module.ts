import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganizationLoginComponent } from './organization-login/organization-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { HeaderComponent } from './common/header/header.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { SiteLayoutComponent } from './common/site-layout/site-layout.component';
import { FooterComponent } from './common/footer/footer.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FourColumnPipe } from './core/pipe/four-column.pipe';
import { CommonsharedModule } from './module/shared/commonshared/commonshared.module';
import { PrimengModule } from './module/shared/primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { AuthInterceptor } from './core/interceptors/http-interceptor';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    OrganizationLoginComponent,
    UserLoginComponent,
    HeaderComponent,
    SideMenuComponent,
    SiteLayoutComponent,
    FooterComponent,
    FourColumnPipe,
    PrintTicketComponent,
    ErrorComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonsharedModule,
    PrimengModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService,  
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor ,
      multi: true
    },
    { provide: ErrorHandler, 
      useClass: GlobalErrorHandlerService
    }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
