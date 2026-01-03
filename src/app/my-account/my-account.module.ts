import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrimengModule } from '../module/shared/primeng/primeng.module';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { CommonsharedModule } from '../module/shared/commonshared/commonshared.module';
import { ChangeLocationComponent } from './change-location/change-location.component';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FeedBackSuggestionComponent } from './feed-back-suggestion/feed-back-suggestion.component';
import { CheckPrintingTemplatesModule } from './check-printing-templates/check-printing-templates.module';
import { DocumentBuilderComponent } from './check-printing-templates/document-builder/document-builder.component';
import { ChangeCashDrawerComponent } from './change-cash-drawer/change-cash-drawer.component';



export const routes: Routes = [{
  path: 'subscription',
  component: SubscriptionComponent
},
{
  path: 'view-cart',
  component:ViewCartComponent
},
{
  path: 'change-password',
  component: ChangePasswordComponent
},
{
  path: 'change-location',
  component:ChangeLocationComponent
},
{
  path: 'feedback',
  component: FeedBackSuggestionComponent
},
{
  path: 'check-printing-template',
  component: DocumentBuilderComponent
},
{
  path: 'change-cashdrawer',
  component: ChangeCashDrawerComponent
}



]


@NgModule({
  declarations: [
    SubscriptionComponent,
    ChangePasswordComponent,
    ViewCartComponent,
    ChangeLocationComponent,
    FeedBackSuggestionComponent,
    ChangeCashDrawerComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MyAccountModule { }
