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

]


@NgModule({
  declarations: [
    SubscriptionComponent,
    ChangePasswordComponent,
    ViewCartComponent,
    ChangeLocationComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MyAccountModule { }
