import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLocationManagementComponent } from './admin-location-management/admin-location-management.component';
import { ToastModule } from 'primeng/toast';

export const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'admin-location',
    component: AdminLocationManagementComponent
  }
]

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLocationManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PrimengModule,
    ToastModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
