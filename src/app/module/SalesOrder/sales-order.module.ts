import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderDashboardComponent } from './sales-order-dashboard/sales-order-dashboard.component';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';
import { DatePipe } from '@angular/common';

export const routes: Routes = [
  {
    path:'',
    component:SalesOrderDashboardComponent
  },
  {
    path:'salesOrderdetail/:salesOrderId/:customerId/:isBuniessUser',
    component:SalesOrderDetailComponent
  }
]



@NgModule({
  declarations: [
    SalesOrderDashboardComponent,
    SalesOrderDetailComponent
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
export class SalesOrderModule { }
