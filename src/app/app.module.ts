import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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


import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FourColumnPipe } from './core/pipe/four-column.pipe';
import { CommonsharedModule } from './module/shared/commonshared/commonshared.module';
import { PrimengModule } from './module/shared/primeng/primeng.module';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonsharedModule,
    PrimengModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
