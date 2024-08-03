import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { InvoiceTicketDashboardComponent } from './invoice-ticket-dashboard/invoice-ticket-dashboard.component';
import { InvoiceTicketDetailComponent } from './invoice-ticket-detail/invoice-ticket-detail.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CheckplanGuard } from 'src/app/core/guard/checkplan.guard';
import { InvoiceCalculatorComponent } from './Invoice-calculator/invoice-calculator.component';

export const routes: Routes = [
  {
    path:'',
    component:InvoiceTicketDashboardComponent
  },
  {
    path:'detail/:ticketId/:customerId',
    canActivate: [CheckplanGuard],
    component:InvoiceTicketDetailComponent
  }
]

@NgModule({
  declarations: [
    InvoiceTicketDashboardComponent,
    InvoiceTicketDetailComponent,
    InvoiceCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxExtendedPdfViewerModule,
    PrimengModule
  ],
  providers: [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TicketsInvoiceModule { }
