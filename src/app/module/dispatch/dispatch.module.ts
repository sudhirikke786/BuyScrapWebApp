import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchDashboardComponent } from './dispatch-dashboard/dispatch-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { FullCalnderDispatchComponent } from './full-calnder-dispatch/full-calnder-dispatch.component';
import { FullCalendarModule } from '@fullcalendar/angular';

export const routes: Routes = [
  {
    path: '',
    component: DispatchDashboardComponent
  },{
    path:'meeting',
    component:FullCalnderDispatchComponent
  }
]


@NgModule({
  declarations: [
    DispatchDashboardComponent,
    FullCalnderDispatchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    FullCalendarModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PrimengModule,
  ]
})
export class DispatchModule { }
