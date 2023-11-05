import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';
import { DailyTicketsReportComponent } from './daily-tickets-report/daily-tickets-report.component';
import { SingleTicketsReportComponent } from './single-tickets-report/single-tickets-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { CashDrawerReportComponent } from './cash-drawer-report/cash-drawer-report.component';
import { CustomerReportComponent } from './customer-report/customer-report.component';
import { MaterialReportComponent } from './material-report/material-report.component';
import { SubMaterialReportComponent } from './sub-material-report/sub-material-report.component';
import { VoidTicketReportComponent } from './void-ticket-report/void-ticket-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { AccountingReportComponent } from './accounting-report/accounting-report.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

export const routes: Routes = [
  {
    path: '',
    component: ReportsDashboardComponent
  },
  {
    path:'daily-tickets-report',
    component:DailyTicketsReportComponent
  },
  {
    path:'single-tickets-report',
    component:SingleTicketsReportComponent
  },
  {
    path:'inventory-report',
    component:InventoryReportComponent
  },
  {
    path:'cash-drawer-report',
    component:CashDrawerReportComponent
  },
  {
    path:'customer-report',
    component:CustomerReportComponent
  },
  {
    path:'material-report',
    component:MaterialReportComponent
  },
  {
    path:'sub-material-report',
    component:SubMaterialReportComponent
  },
  {
    path:'void-ticket-report',
    component:VoidTicketReportComponent
  },
  {
    path:'payment-report',
    component:PaymentReportComponent
  },
  {
    path:'accounting-report',
    component:AccountingReportComponent
  }
]

@NgModule({
  declarations: [
    ReportsDashboardComponent,
    DailyTicketsReportComponent,
    SingleTicketsReportComponent,
    InventoryReportComponent,
    CashDrawerReportComponent,
    CustomerReportComponent,
    MaterialReportComponent,
    SubMaterialReportComponent,
    VoidTicketReportComponent,
    PaymentReportComponent,
    AccountingReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    NgxExtendedPdfViewerModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PrimengModule
  ],
  providers: [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ReportsModule { }
