import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrimengModule } from '../module/shared/primeng/primeng.module';

import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [{
  path:'subscription',
  component:SubscriptionComponent
},
{
  path:'change-password',
  component:ChangePasswordComponent
},

]


@NgModule({
  declarations: [
    SubscriptionComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule.forChild(routes)
  ]
})
export class MyAccountModule { }
