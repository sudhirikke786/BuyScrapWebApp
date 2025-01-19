import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchDashboardComponent } from './dispatch-dashboard/dispatch-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { FullCalnderDispatchComponent } from './full-calnder-dispatch/full-calnder-dispatch.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DispatchLatestDetailsComponent } from './dispatch-latest-details/dispatch-latest-details.component';
import { DispatchOrderStatusComponent } from './dispatch-order-status/dispatch-order-status.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

export const routes: Routes = [
  {
    path: '',
    component: DispatchDashboardComponent
  },
  {
    path: 'dispatch-detail/:rowId/:sellerID/:type',
    component: DispatchLatestDetailsComponent
  },
  {
    path: 'dispatch-status',
    component: DispatchOrderStatusComponent
  },
  {
    path:'meeting',
    component:FullCalnderDispatchComponent
  }
]


@NgModule({
  declarations: [
    DispatchDashboardComponent,
    FullCalnderDispatchComponent,
    DispatchLatestDetailsComponent,
    DispatchOrderStatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    FullCalendarModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxExtendedPdfViewerModule,
    PrimengModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DispatchModule { }
