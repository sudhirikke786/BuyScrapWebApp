import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderDashboardComponent } from './purchase-order-dashboard/purchase-order-dashboard.component';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';

export const routes: Routes = [
  {
    path:'',
    component:PurchaseOrderDashboardComponent
  },
 {
    path:'purchaseOrderdetail/:purchaseOrderId/:customerId/:isBuniessUser',
    component:PurchaseOrderDetailComponent
  }
]

@NgModule({
  declarations: [
    PurchaseOrderDashboardComponent,
    PurchaseOrderDetailComponent
  ],
  imports: [
     CommonModule,
      RouterModule.forChild(routes),
      CommonsharedModule,
      PrimengModule,
      FormsModule,
      ReactiveFormsModule,
   ],
     providers: [DatePipe],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
 })
export class PurchaseOrderModule { }
