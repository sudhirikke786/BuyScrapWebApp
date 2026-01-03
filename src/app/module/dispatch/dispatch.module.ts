import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { DispatchLayoutComponent } from './dispatch-layout/dispatch-layout.component';
import { DispatchMapComponent } from './dispatch-map/dispatch-map.component';
import { GoogleMapsModule } from '@angular/google-maps';

export const routes: Routes = [
  {
    path: '',
    component: DispatchLayoutComponent, 
    children: [
      { path: '', 
        component: DispatchDashboardComponent 
      }, 
      { path: 'meeting', 
        component: FullCalnderDispatchComponent } 
    ]
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
    path: 'map', 
    component: DispatchMapComponent 
  }
]


@NgModule({
  declarations: [
    DispatchDashboardComponent,
    FullCalnderDispatchComponent,
    DispatchLatestDetailsComponent,
    DispatchOrderStatusComponent,
    DispatchLayoutComponent,
    DispatchMapComponent
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
    GoogleMapsModule
  ],
  providers: [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DispatchModule { }
