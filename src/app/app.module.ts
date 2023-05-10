import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganizationLoginComponent } from './organization-login/organization-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { HeaderComponent } from './common/header/header.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { SiteLayoutComponent } from './common/site-layout/site-layout.component';
import { TicketsComponent } from './home/tickets/tickets.component';
import { FooterComponent } from './common/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    OrganizationLoginComponent,
    UserLoginComponent,
    HeaderComponent,
    SideMenuComponent,
    SiteLayoutComponent,
    TicketsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
