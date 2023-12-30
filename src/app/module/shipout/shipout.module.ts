import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { ShipoutDashboardComponent } from './shipout-dashboard/shipout-dashboard.component';
import { ShipoutDetailsComponent } from './shipout-details/shipout-details.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


export const routes: Routes = [
  {
    path: '',
    component: ShipoutDashboardComponent
  },
  {
    path:'detail/:ticketId/:customerId',
    component: ShipoutDetailsComponent
  }
]

@NgModule({
  declarations: [
    ShipoutDashboardComponent,
    ShipoutDetailsComponent
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
export class ShipoutModule { }
